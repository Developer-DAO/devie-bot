import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';

// TODO: Load these values from the appropriate table in AirTable
export const setLevelSelection = async (dmChannel: DMChannel) => {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('level')
      .setPlaceholder('Select level')
      .addOptions([
        {
          label: 'Beginner',
          value: 'Beginner',
        },
        {
          label: 'Intermediate',
          value: 'Intermediate',
        },
        {
          label: 'Advanced',
          value: 'Advanced',
        },
      ]),
  );
  return await dmChannel.send({
    content: 'Select resource level',
    components: [row],
  });
};
