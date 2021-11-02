import Airtable from 'airtable';
import dotenv from 'dotenv'

dotenv.config()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const base = new Airtable({ apiKey: 'keyuXGvCSuSPgPJUi' }).base('app5gBnmcY3h9txt0')
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