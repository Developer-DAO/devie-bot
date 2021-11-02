import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';

export const setBlockchainSelection = async (dmChannel: DMChannel) => {
  const options = [
      {
        label: 'Ethereum',
        value: 'ethereum',
      },
      {
        label: 'Solana',
        value: 'solana',
      },
      {
        label: 'Bitcoin',
        value: 'bitcoin',
      },
      {
        label: 'Rinkeby',
        value: 'rinkeby',
      },
      {
        label: 'Ropsten',
        value: 'ropsten',
      },
      {
        label: 'Kovan',
        value: 'kovan',
      },
    ];
  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
    .setCustomId('blockchains')
    .setPlaceholder('Select blockchains')
    .setMaxValues(Math.min(options.length, 25))
    .addOptions(options),
  );
  return await dmChannel.send({
    content: 'Select blockchains',
    components: [row],
  });
}
