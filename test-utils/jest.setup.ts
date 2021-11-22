import { InternalDiscordManager } from './setup';
import { server } from './mock-server';

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
