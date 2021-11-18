import { InternalDiscordManager } from './setup';
import { server } from './mock-server';

process.env.DISCORD_BOT_TOKEN = 'FAKE_BOT_TOKEN'

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
