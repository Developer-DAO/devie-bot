import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { SlashCommandConfig } from '../types';
import { isContributor, createContributor, getCleanDevID, isAirtableError } from '../utils';
import { isHandledError } from '../utils/error';
import { createTwitterHandle } from '../utils/twitterHandle';

export const AddContributorCommand: SlashCommandConfig = {
  name: 'add-contributor',
  roles: ['dev'],
  commandJSON: () => new SlashCommandBuilder()
    .setName('add-contributor')
    .setDescription('Add yourself to the contributor list')
    .addStringOption(
      option => option.setRequired(false)
        .setName('devdao-id')
        .setDescription('Enter your DevDAO ID (e.g. #2468)'))
    .addStringOption(
      option => option.setRequired(false)
        .setName('twitter')
        .setDescription('Enter your twitter handle (e.g. @developer_dao')).toJSON(),
  execute: async (interaction: CommandInteraction) => {
    if (await isContributor(interaction.user)) {
      interaction.reply({ content: 'Sorry! You can not add yourself because you are already a contributor!', ephemeral: true });
      return;
    }

    const devDAOID = interaction.options.getString('devdao-id');
    const devID = getCleanDevID(devDAOID);

    if (devID && isNaN(devID)) {
      return interaction.reply({ content: 'The DevDAO ID you provided is not valid, please try again.', ephemeral: true });
    }

    let twitterHandle = interaction.options.getString('twitter');
    if (twitterHandle) {
      const twitterResponse = createTwitterHandle(twitterHandle);
      if (!twitterResponse.isValid) {
        return interaction.reply({ content: 'The twitter handle you provided is not valid, please try again.', ephemeral: true });
      }
      else {
        twitterHandle = twitterResponse.URL;
      }
    }
    try {
      await createContributor(interaction.user, devID, twitterHandle ?? undefined);
      interaction.reply({ content: 'You added yourself as a contributer! Congrats', ephemeral: true });
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
        console.log('Error trying to follow up add-contributor', e);
      }
    }
    return;
  },
}
