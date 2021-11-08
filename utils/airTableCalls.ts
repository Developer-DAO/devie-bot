import Airtable from 'airtable';
import AirtableError from 'airtable/lib/airtable_error';
import dotenv from 'dotenv'

import HandledError from './error';
import { normalizeString } from './normalizeString';

import { AuthorInfo } from '../types/author';

dotenv.config()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const base = new Airtable({ apiKey: 'keyuXGvCSuSPgPJUi' }).base('app5gBnmcY3h9txt0');

const TABLES = {
    AUTHOR: () => base('Authors'),
    CONTRIBUTOR: () => base('Contributor'),
};

export async function isContributor(discordIdOfCommandCaller: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const discordHandles: any[] = []
    const table = base('Contributor')
    const contributors = await table.select({
        // eslint-disable-next-line quotes
        filterByFormula: "NOT({Discord Handle} = '')",
    }).all();
    for (const record of contributors) {
        const discordHandle = record.fields['Discord Handle']
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        discordHandles.push(discordHandle.split('#')[1])
    }
    for (const digits of discordHandles) {
        if (discordIdOfCommandCaller === digits) {
            return true
        }
    }
    return false
}

async function findAuthor(name:string) {
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
