import { DMChannel, MessageActionRow, MessageSelectMenu } from 'discord.js';

export const setTagSelection = async (dmChannel: DMChannel) => {
  const options = [
      {
        label: 'Solidity',
        value: 'solidity',
      },
      {
        label: 'React',
        value: 'React',
      },
      {
        label: 'Rust',
        value: 'rust',
      },
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
    .setCustomId('tags')
    .setPlaceholder('Select tags')
    .setMaxValues(Math.min(options.length, 25))
    .addOptions(options),
  );
  return await dmChannel.send({
    content: 'Select tags',
    components: [row],
  });
}
