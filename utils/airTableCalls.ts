import Airtable from 'airtable';
import dotenv from 'dotenv'

dotenv.config()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const base = new Airtable({ apiKey: 'keyuXGvCSuSPgPJUi' }).base('app5gBnmcY3h9txt0')
export async function isContributor(discordId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const discordHandles: any[] = []
    const table = base('Contributor')
    const contrib = await table.select({
        // eslint-disable-next-line quotes
        filterByFormula: "NOT({Discord Handle} = '')",
    }).all();
    for (const record of contrib) {
        let discordHandle = record.fields['Discord Handle']
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        discordHandle = discordHandle.split('#')
        // if the original handle is kempsterrrr#8590, this will populate the array with 8590
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        discordHandles.push(discordHandle[1])
    }
    for (let digits======)
}
const hello = isContributor('hello');
console.log(hello)