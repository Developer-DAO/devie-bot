import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { LookupItem } from '../../types';
import { readTags } from '../../utils';

export const setTagSelection = async (dmChannel: DMChannel): Promise<LookupItem[]> => {
  const tags = await readTags();
  const options = tags.map(tag => ({ label: tag.name, value: tag.id }));
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
    .setCustomId('tags')
    .setPlaceholder('Select tags')
    .setMaxValues(Math.min(options.length, 25))
    .addOptions(options),
  );
  const tagMessage = await dmChannel.send({
    content: 'Select tags',
    components: [row],
  });
  const tagResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>();
  tagMessage.delete();
  return tagResponse.values.map(v => {
    const lookupItem = tags.find((value) => value.id === v);
    return lookupItem ?? { name: 'Unknown', id: v };
  });
}
