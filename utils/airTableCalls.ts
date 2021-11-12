import Airtable, { FieldSet, Table } from 'airtable';
import AirtableError from 'airtable/lib/airtable_error';
import { User } from 'discord.js';
import dotenv from 'dotenv'
import { Author as AuthorInfo, LookupItem, Resource } from '../types';
import HandledError from './error';
import { normalizeString } from './normalizeString';

dotenv.config()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN! }).base(process.env.AIRTABLE_BASE!)

const TABLES = {
  AUTHOR: () => base('Authors'),
  CONTRIBUTOR: () => base('Contributor'),
  TAGS: () => base('Tags'),
  CATEGORY: () => base('Category'),
  BLOCKCHAIN: () => base('Blockchain'),
  RESOURCES: () => base('Resources'),
};

export async function isContributor(user: User) {
  const foundUser = await findContributor(user);
  if (foundUser) {
    return true;
  }
  else {
    return false;
  }
}

export async function createContributor(user: User, nftID?: number, twitterHandle?: string, ethWalletAddress?: string) {
  const table = TABLES.CONTRIBUTOR();
  const records = await table.create([
    {
      'fields': {
        'Discord Handle': `${user.username}:${user.discriminator}`,
        'Discord ID': `${user.id}`,
        'DevDAO ID': nftID,
        'Twitter Handle': twitterHandle ?? '',
        'ETH Wallet Address': ethWalletAddress ?? '',
      },
    },
  ]);

  if (records.length === 1) {
    const addedRecord = records[0];
    return addedRecord.getId();
  }
}

async function findAuthor(name: string) {
  return await TABLES.AUTHOR().select({
    filterByFormula: `{Name}="${name}"`,
  }).all();
}

export async function createAuthor(author: AuthorInfo) {
  const { name, isDaoMember, twitterUrl, youtubeUrl } = author;
  const authorList = await findAuthor(name);
  if (authorList.length) {
    throw new HandledError(`Author ${name} already exists`);
  }

  const record = {
    Name: normalizeString(name),
    'Developer DAO Member': isDaoMember,
    Twitter: twitterUrl || '',
    YouTube: youtubeUrl || '',
    Resource: [],
  };

  await TABLES.AUTHOR().create([{ fields: record }]);
}

export function isAirtableError(value: unknown): value is AirtableError {
  return value instanceof AirtableError;
}

export async function createTag(tag: string) {
  const records = await TABLES.TAGS().create([
    {
      'fields': {
        Name: tag,
      },
    },
  ]);
  records?.forEach((record) => console.log(record.getId()));
}

export async function createCategory(category: string) {
  const records = await TABLES.CATEGORY().create([
    {
      'fields': {
        Name: category,
      },
    },
  ])
  records?.forEach((record) => console.log(record.getId()));
}

export async function createBlockchain(blockchain: string, website: string | null) {
  const records = await TABLES.BLOCKCHAIN().create([
    {
      'fields': {
        Name: blockchain,
        Website: website ?? '',
      },
    },
  ])
  records?.forEach((record) => console.log(record.getId()));
}

export async function createResource(resource: Resource) {
  try {
    await TABLES.RESOURCES().create([
      {
        fields: {
          Title: resource.title,
          Source: resource.source,
          Summary: resource.summary,
          Level: resource.level,
          Blockchain: resource.blockchain,
          Category: resource.category,
          Tags: resource.tags,
          'Media Type': resource.mediaType,
          Author: [resource.author],
          Contributor: [resource.contributor],
        },
      },
    ]);
    return { success: true };
  }
  catch (error) {
    console.error(error);
    return { success: false, error };
  }
}

export async function findContributor(user: User) {
  // const discordHandle = `${user.username}:${user.discriminator}`;
  const discordID = `${user.id}`;
  const records = await TABLES.CONTRIBUTOR().select({
    // filterByFormula: `{Discord Handle} = '${discordHandle}'`,
    filterByFormula: `{Discord Id} = '${discordID}'`,
    maxRecords: 1,
    view: 'Grid view',
  }).all();
  if (records) {
    return records[0];
  }
}

export function readAuthors(): Promise<LookupItem[]> {
  return readLookup(TABLES.AUTHOR());
}

export function readTags(): Promise<LookupItem[]> {
  return readLookup(TABLES.TAGS());
}

export function readCategory(): Promise<LookupItem[]> {
  return readLookup(TABLES.CATEGORY());
}

export function readBlockchain(): Promise<LookupItem[]> {
  return readLookup(TABLES.BLOCKCHAIN());
}

export function readLookup(table: Table<FieldSet>): Promise<LookupItem[]> {
  return new Promise((resolve, reject) => {
    const items: LookupItem[] = [];
    table.select({
      maxRecords: 10,
      view: 'Grid view',
    }).eachPage(function page(records, fetchNextPage) {
      records.forEach(record => {
        const name = record.get('Name');
        const id = record.id;
        items.push({
          id,
          name: `${name}`,
        });
      });

      fetchNextPage();
    }, function done(err) {
      if (err) {
        console.error(err);
        reject(err);
      }
      items.sort((a, b) => a.name.localeCompare(b.name));
      resolve(items);
    });
  })
}

export async function findResourceByUrl(url: string): Promise<LookupItem | undefined> {
  const records = await TABLES.RESOURCES().select({
    filterByFormula: `LOWER({Source}) = '${url.toLowerCase()}'`,
    view: 'Grid view',
  }).all();
  if (records && records.length > 0) {
    const first = records[0];
    return { name: `${first.get('name')}`, id: first.id };
  }
  else {
    return undefined;
  }
}

export function findAuthorByName(name: string): Promise<LookupItem | undefined> {
  return findLookupItemByName(TABLES.AUTHOR(), name);
}

export function findTagByName(name: string): Promise<LookupItem | undefined> {
  return findLookupItemByName(TABLES.TAGS(), name);
}

export function findCategoryByName(name: string): Promise<LookupItem | undefined> {
  return findLookupItemByName(TABLES.CATEGORY(), name);
}

export function findBlockchainByName(name: string): Promise<LookupItem | undefined> {
  return findLookupItemByName(TABLES.BLOCKCHAIN(), name);
}

export async function findLookupItemByName(table: Table<FieldSet>, name: string): Promise<LookupItem | undefined> {
  const records = await table.select({
    filterByFormula: `LOWER({Name}) = '${name.toLowerCase()}'`,
    view: 'Grid view',
  }).all();
  if (records && records.length > 0) {
    const first = records[0];
    return { name: `${first.get('Name')}`, id: first.id };
  }
  else {
    return undefined;
  }
}
