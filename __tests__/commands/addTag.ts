import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { execute } from '../../commands/addTag';
import { setup, InternalDiscordManager } from '../../test-utils/setup';

describe('Command add-tag', () => {
  it('should not run if tag is null', async () => {
    const { createCommandInteraction } = await setup();
    const interaction = createCommandInteraction(
      'add-tag',
      [{ name: 'tag', type: ApplicationCommandOptionTypes.STRING, value: null }],
    );

    await execute(interaction);

    const capturedMessageFromMockServer = InternalDiscordManager.interaction[interaction.id];
    expect(capturedMessageFromMockServer.content).toEqual('Tag missing, please try again.');
  });
});
