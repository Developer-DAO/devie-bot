import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { LookupItem } from '../../types';
import { readCategory } from '../../utils';

export const setCategorySelection = async (dmChannel: DMChannel): Promise<LookupItem[]> => {
  const categories = await readCategory();
  const options = categories.map(tag => ({ label: tag.name, value: tag.id }));
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
    .setCustomId('category')
    .setPlaceholder('Select categories')
    .setMaxValues(Math.min(options.length, 25))
    .addOptions(options),
  );
  const categoryMessage = await dmChannel.send({
    content: 'Select categories',
    components: [row],
  });
  const categoryResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>();
  categoryMessage.delete();
  return categoryResponse.values.map(v => {
    const lookupItem = categories.find((value) => value.id === v);
    return lookupItem ?? { name: 'Unknown', id: v };
  });
}
