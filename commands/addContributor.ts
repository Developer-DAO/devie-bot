import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isContributor, createContributor } from '../utils';
import { createTwitterHandle } from '../utils/twitterHandle';

export const data = new SlashCommandBuilder()
  .setName('add-contributor')
  .setDescription('add yourself to the contributor list')
  .addStringOption(
    option => option.setRequired(false)
      .setName('devdao-id')
      .setDescription('Enter your DevDAO ID (e.g. #2468)'))
  .addStringOption(
    option => option.setRequired(false)
      .setName('twitter')
      .setDescription('Enter your twitter handle'))
  .addStringOption(
    option => option.setRequired(false)
      .setName('eth-wallet-address')
      .setDescription('Enter your ETH wallet address'));

export async function execute(interaction: CommandInteraction) {
  if (await isContributor(interaction.user)) {
    interaction.reply({ content: 'Sorry! You can not add yourself because you are already a contributor!', ephemeral: true });
    return;
  }

  const devDAOID = interaction.options.getString('devdao-id');
  let twitterHandle = interaction.options.getString('twitter');
  if (twitterHandle) {
    const twitterResponse = createTwitterHandle(twitterHandle);
    if (!twitterResponse.isValid) {
      return interaction.reply({ content: 'The twitter handle you provided is not valid, please try again.', ephemeral: true });
    }
    else {
      twitterHandle = twitterResponse.handle;
      // twitterHandle = twitterResponse.URL;
    }
  }
  const ethWalletAddress = interaction.options.getString('eth-wallet-address');
  await createContributor(interaction.user, devDAOID ?? '', twitterHandle ?? '', ethWalletAddress ?? '');
  interaction.reply({ content: 'You added yourself as a contributer! Congrats', ephemeral: true });
  return;
}
