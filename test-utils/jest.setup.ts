import { InternalDiscordManager } from './setup';
import { server } from './mock-server';

process.env.DISCORD_TOKEN = 'FAKE_BOT_TOKEN';
process.env.AIRTABLE_TOKEN = 'FAKE_AIRTABLE_TOKEN';
process.env.AIRTABLE_BASE = 'FAKE_TABLE_NAME';
process.env.GUILD_ID = 'DEV_DAO_ID';
process.env.CLIENT_ID = 'FAKE_CLIENT_ID';

beforeEach(() => jest.spyOn(Date, 'now'))
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers()
  InternalDiscordManager.cleanup()
  jest.restoreAllMocks()
  if (jest.isMockFunction(setTimeout)) {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  }
});
