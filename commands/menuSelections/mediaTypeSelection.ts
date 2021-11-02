import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';

export const setMediaTypeSelection = async (dmChannel: DMChannel) => {
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('mediaType')
      .setPlaceholder('Select media type')
      .addOptions([
        {
          label: 'Video',
          value: 'video',
        },
        {
          label: 'Text',
          value: 'text',
        },
        {
          label: 'Free Course',
          value: 'free_course',
        },
        {
          label: 'Paid Course',
          value: 'paid_course',
        },
      ]),
  );
  return await dmChannel.send({
    content: 'Select media type',
    components: [row],
  });
};
