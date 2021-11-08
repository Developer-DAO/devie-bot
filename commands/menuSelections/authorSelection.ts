import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { LookupItem } from '../../types';
import { readAuthors } from '../../utils';

export const setAuthorSelection = async (dmChannel: DMChannel): Promise<LookupItem[]> => {
  const authors = await readAuthors();
  const options = authors.map(tag => ({ label: tag.name, value: tag.id }));
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
    .setCustomId('auhtors')
    .setPlaceholder('Select author')
    .addOptions(options),
  );
  const authorMessage = await dmChannel.send({
    content: 'Select authors',
    components: [row],
  });
  const authorResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>();
  authorMessage.delete();
  return authorResponse.values.map(v => {
    const lookupItem = authors.find((value) => value.id === v);
    return lookupItem ?? { name: 'Unknown', id: v };
  });
}
