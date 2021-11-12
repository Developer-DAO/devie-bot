import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';

// TODO: Load these values from the appropriate table in AirTable
// We need to have access to the Metadata API to access the possible values for the field
// https://airtable.com/api/meta
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
          label: 'Article',
          value: 'Article',
        },
        {
          label: 'Free Course',
          value: 'Free Course',
        },
        {
          label: 'Paid Course',
          value: 'Paid Course',
        },
      ]),
  );
  return await dmChannel.send({
    content: 'Select media type',
    components: [row],
  });
};
