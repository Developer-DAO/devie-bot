import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { createBlockchain } from '../utils';

export const data = new SlashCommandBuilder()
    .setName('add-blockchain')
    .setDescription('Adds a blockchain to the knowledge base')
    .addStringOption(
      option => option.setRequired(true)
      .setName('blockchain')
      .setDescription('Enter a blockchain'))
    .addStringOption(
      option => option.setRequired(false)
      .setName('website')
      .setDescription('Enter blockchain website'));

export async function execute(interaction: CommandInteraction) {
  const blockchain = interaction.options.getString('blockchain');
  const website = interaction.options.getString('website');
  const REPLY = {
     YES: 'yes',
     NO: 'no',
   };

  const noButton = new MessageButton()
    .setCustomId(REPLY.NO)
    .setLabel('Cancel')
    .setStyle('DANGER');
  const yesButton = new MessageButton()
    .setCustomId(REPLY.YES)
    .setLabel('Add blockchain')
    .setStyle('PRIMARY');
  const buttonRow = new MessageActionRow()
    .addComponents(
      noButton,
      yesButton,
    );

  if (blockchain === undefined || blockchain == null) {
    interaction.reply('Blockchain missing, please try again.');
    return;
  }

  await interaction.reply({
    content: `Are you sure you want to add ${blockchain}?`,
    components: [buttonRow],
    ephemeral: true,
  });

  const buttonReply = await interaction.channel?.awaitMessageComponent({ componentType: 'BUTTON' });
  if (!buttonReply) {
    return;
  }

  const buttonSelected = buttonReply.customId;
  buttonReply.update({ components: [] });
  if (buttonSelected === REPLY.NO) {
    buttonReply.followUp({
      content: `"${blockchain}" was not added`,
      ephemeral: true,
    })
    return;
  }
  else {
    try {
      await createBlockchain(blockchain, website);
      await interaction.editReply('Thank you. The blockchain has been added.');
    }
    catch (e) {
      await interaction.editReply('Unfortunately something went wrong adding the blockchain. Please try again later.');
    }
  }
}
