import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';

// TODO: Load these values from the appropriate table in AirTable
export const setCategorySelection = async (dmChannel: DMChannel) => {
  const options = [
      {
        label: 'Dapps',
        value: 'dapps',
      },
      {
        label: 'Smart Contracts',
        value: 'smart_contracts',
      },
    ]
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
    .setCustomId('category')
    .setPlaceholder('Select categories')
    .setMaxValues(Math.min(options.length, 25))
    .addOptions(options),
  );
  return await dmChannel.send({
    content: 'Select categories',
    components: [row],
  });
}
