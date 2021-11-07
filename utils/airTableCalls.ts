import Airtable from 'airtable';
import AirtableError from 'airtable/lib/airtable_error';
import { User } from 'discord.js';
import dotenv from 'dotenv'
import { LookupItem, Resource } from '../types';

dotenv.config()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const BASE = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN! }).base(process.env.AIRTABLE_BASE!)

export async function isContributor(user: User) {
    const foundUser = await findContributor(user);
    if (foundUser) {
      return true;
    }
    else {
      return false;
    }
}

export async function createContributor(user: User, nftID: string, twitterHandle: string, ethWalletAddress: string) {
    const table = BASE('Contributor')
    const records = await table.create([
        {
            'fields': {
                // 'Discord Handle': `${user.username}:${user.discriminator}`,
                'DiscordId': `${user.id}`,
                'DevDAO ID': parseInt(nftID),
                'Twitter Handle': twitterHandle,
                'ETH Wallet Address': ethWalletAddress,
            },
        },
    ]);

    if (records.length === 1) {
      const addedRecord = records[0];
      return addedRecord.getId();
    }
}

export async function createTag(tag: string) {
  const table = BASE('Tags');
  const records = await table.create([
    {
      'fields': {
        Name: tag,
      },
    },
  ]);
  records?.forEach((record) => console.log(record.getId()));
}

export async function createCategory(category: string) {
  const table = BASE('Category');
  const records = await table.create([
    {
      'fields': {
        Name: category,
      },
    },
  ])
  records?.forEach((record) => console.log(record.getId()));
}

export async function createBlockchain(blockchain: string, website: string | null) {
  const table = BASE('Blockchain');
  const records = await table.create([
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
    const table = BASE('Resources');
    await table.create([
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
  const table = BASE('Contributor');
  // const discordHandle = `${user.username}:${user.discriminator}`;
  const discordID = `${user.id}`;
  const records = await table.select({
    // filterByFormula: `{Discord Handle} = '${discordHandle}'`,
    filterByFormula: `{DiscordId} = '${discordID}'`,
    maxRecords: 1,
    view: 'Grid view',
  });
  if (records) {
    const all = await records.all();
    console.log(all);
    return all[0];
  }
}

export function readAuthors(): Promise<LookupItem[]> {
  return readLookup('Authors');
}

export function readTags(): Promise<LookupItem[]> {
  return readLookup('Tags');
}

export function readCategory(): Promise<LookupItem[]> {
  return readLookup('Category');
}

export function readBlockchain(): Promise<LookupItem[]> {
  return readLookup('Blockchain');
}

export function readLookup(tableName: string): Promise<LookupItem[]> {
  return new Promise((resolve, reject) => {
    const table = BASE(tableName);
    const items: LookupItem[] = [];
    table.select({
        maxRecords: 10,
        view: 'Grid view',
      }).eachPage(function page(records, fetchNextPage) {
          records.forEach(function(record) {
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

export async function findResourceByUrl(url: string): Promise<LookupItem> {
  const table = BASE('Resources');
  const records = await table.select({
    filterByFormula: `LOWER({Source}) = '${url.toLowerCase()}'`,
    view: 'Grid view',
  });
  if (records) {
    const all = await records.all();
    const first = all[0];
    return { name: `${first.get('name')}`, id: first.id };
  }
  else {
    throw new AirtableError('Not found', 'Item not found', 404);
  }
}

export function findAuthorByName(name: string): Promise<LookupItem | undefined> {
  return findLookupItemByName('Authors', name);
}

export function findTagByName(name: string): Promise<LookupItem | undefined> {
  return findLookupItemByName('Tags', name);
}

export function findCategoryByName(name: string): Promise<LookupItem | undefined> {
  return findLookupItemByName('Category', name);
}

export function findBlockchainByName(name: string): Promise<LookupItem | undefined> {
  return findLookupItemByName('Blockchain', name);
}

export async function findLookupItemByName(tableName: string, name: string): Promise<LookupItem | undefined> {
  const table = BASE(tableName);
  const records = await table.select({
    filterByFormula: `LOWER({Name}) = '${name.toLowerCase()}'`,
    view: 'Grid view',
  });
  if (records) {
    const all = await records.all();
    const first = all[0];
    return { name: `${first.get('Name')}`, id: first.id };
  }
  else {
    return undefined;
  }
}
