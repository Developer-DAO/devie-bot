import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { AddTagCommand } from '../../slashCommands/addTag';
import { setup, InternalDiscordManager } from '../../test-utils/setup';

describe('Command add-tag', () => {
  it('should not run if tag is null', async () => {
    const { createCommandInteraction } = await setup();
    const interaction = createCommandInteraction(
      'add-tag',
      [{ name: 'tag', type: ApplicationCommandOptionTypes.STRING, value: null }],
    );

    await AddTagCommand.execute(interaction);

    const capturedMessageFromMockServer = InternalDiscordManager.interaction[interaction.id];
    expect(capturedMessageFromMockServer.content).toEqual('Tag missing, please try again.');
  });
});
