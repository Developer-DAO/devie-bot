import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { execute } from '../../commands/addTag';
import { setup } from '../../test-utils/setup';
import { server } from '../../test-utils/test-server';

describe('Command add-tag', () => {
  it('should not run if tag is null', async () => {
    const { createCommandInteraction } = await setup();
    const interaction = createCommandInteraction(
      'add-tag',
      [{ name: 'tag', type: ApplicationCommandOptionTypes.STRING, value: null }],
    );

    // Instead of mocking this function, we could (should?)
    // add a route to the discord handlers.
    interaction.reply = jest.fn();

    await execute(interaction);
    expect(interaction.reply).toHaveBeenCalledWith('Tag missing, please try again.')
  });
});
