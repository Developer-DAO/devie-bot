import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { ISlashCommandConfig } from '../types';
import { createBlockchain, findBlockchainByName, isAirtableError } from '../utils';
import { isHandledError } from '../utils/error';

export const AddBlockchainCommand: ISlashCommandConfig = {
  name: 'add-blockchain',
  roles: ['dev'],
  commandJSON: () => new SlashCommandBuilder()
    .setName('add-blockchain')
    .setDescription('Adds a blockchain to the knowledge base')
    .addStringOption(
      option => option.setRequired(true)
        .setName('blockchain')
        .setDescription('Enter a blockchain'))
    .addStringOption(
      option => option.setRequired(false)
        .setName('website')
        .setDescription('Enter blockchain website')).toJSON(),
  execute: async (interaction: CommandInteraction) => {
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
      content: `Are you sure you want to add \`${blockchain.trim()}\`?`,
      components: [buttonRow],
      ephemeral: true,
    });

    const interactionMessage = await interaction.fetchReply();

    if (!(interactionMessage instanceof Message)) { return; }

    const buttonReply = await interactionMessage.awaitMessageComponent({ componentType: 'BUTTON' });
    if (!buttonReply) {
      return;
    }

    const buttonSelected = buttonReply.customId;
    buttonReply.update({ components: [] });
    if (buttonSelected === REPLY.NO) {
      buttonReply.followUp({
        content: `"${blockchain.trim()}" was not added`,
        ephemeral: true,
      })
      return;
    }
    else {
      try {
        const foundChain = await findBlockchainByName(blockchain.trim());
        if (foundChain) {
          await interaction.editReply('This blockchain is already registered.');
        }
        else {
          await createBlockchain(blockchain.trim(), website ? website.trim() : website);
          await interaction.editReply('Thank you. The blockchain has been added.');
        }
      }
      catch (error) {
        let errorMessage = 'There was an error saving. Please try again.';
        if (isAirtableError(error)) {
          errorMessage = 'There was an error from Airtable. Please try again.';
        }
        if (isHandledError(error)) {
          errorMessage = error.message;
        }

        try {
          await interaction.followUp({ content: errorMessage, ephemeral: true });
        }
        catch (e) {
          console.log('Error trying to follow up add-blockchain', e);
        }
      }
    }
  },
}
