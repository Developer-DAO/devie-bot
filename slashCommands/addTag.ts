import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { ISlashCommandConfig } from '../types';
import { createTag, findTagByName, isAirtableError } from '../utils';
import { isHandledError } from '../utils/error';

export const AddTagCommand: ISlashCommandConfig = {
  name: 'add-tag',
  roles: ['dev'],
  commandJSON: () => new SlashCommandBuilder()
    .setName('add-tag')
    .setDescription('Adds a tag to the knowledge base')
    .addStringOption(
      option => option.setRequired(true)
        .setName('tag')
        .setDescription('Enter a tag')).toJSON(),
  execute: async (interaction: CommandInteraction) => {
    const tag = interaction.options.getString('tag')
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
      .setLabel('Yes, add tag')
      .setStyle('PRIMARY');
    const buttonRow = new MessageActionRow()
      .addComponents(
        noButton,
        yesButton,
      );

    if (tag === undefined || tag == null) {
      await interaction.reply('Tag missing, please try again.');
      return;
    }

    await interaction.reply({
      content: `Are you sure you want to add \`${tag.trim()}\`?`,
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
        content: `"${tag.trim()}" was not added`,
        ephemeral: true,
      })
      return;
    }
    else {
      try {
        const foundTag = await findTagByName(tag.trim());
        if (foundTag) {
          await interaction.editReply('This tag is already registered.');
        }
        else {
          await createTag(tag.trim());
          await interaction.editReply('Thank you. The tag has been added.');
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
          console.log('Error trying to follow up add-tag', e);
        }
      }
    }
  },
}
