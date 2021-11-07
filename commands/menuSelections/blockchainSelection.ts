import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { LookupItem } from '../../types';
import { readBlockchain } from '../../utils';

export const setBlockchainSelection = async (dmChannel: DMChannel): Promise<LookupItem[]> => {
  const blockchains = await readBlockchain();
  const options = blockchains.map(tag => ({ label: tag.name, value: tag.id }));
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
    .setCustomId('blockchains')
    .setPlaceholder('Select blockchains')
    .setMaxValues(Math.min(options.length, 25))
    .addOptions(options),
  );
  const blockchainMessage = await dmChannel.send({
    content: 'Select blockchains',
    components: [row],
  });
  const blockchainResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>();
  blockchainMessage.delete();
  return blockchainResponse.values.map(v => {
    const lookupItem = blockchains.find((value) => value.id === v);
    return lookupItem ?? { name: 'Unknown', id: v };
  });
}
