import Airtable from 'airtable';
import dotenv from 'dotenv'
import isDiscordId from './discordIdChecker'

dotenv.config()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const BASE = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN! }).base(process.env.AIRTABLE_BASE!)

export async function isContributor(discordHandleOfCommandCaller: string) {
    const table = BASE('Contributor')
    const contributors = await table.select({
        // eslint-disable-next-line quotes
        filterByFormula: "NOT({DiscordId} = '')",
    }).all();
    for (const record of contributors) {
        if (discordHandleOfCommandCaller === record.fields.DiscordId) {
            return true
        }
    }
    return false
}

export async function createContributor(discordIdOfCommandCaller: string) {
    if (isDiscordId(discordIdOfCommandCaller)) {
        const table = BASE('Contributor')
        table.create([
            {
                'fields': {
                    'DiscordId' : `${discordIdOfCommandCaller}`,
                },
            },
        ], (err, records) => {
            if (err) {
                console.error(err)
                return
            }
            records?.forEach((record) => console.log(record.getId))
        })
    }
}