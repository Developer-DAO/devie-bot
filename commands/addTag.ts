import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { createTag, findTagByName, isAirtableError } from '../utils';
import { isHandledError } from '../utils/error';

export const data = new SlashCommandBuilder()
  .setName('add-tag')
  .setDescription('Adds a tag to the knowledge base')
  .addStringOption(
    option => option.setRequired(true)
      .setName('tag')
      .setDescription('Enter a tag'))

export async function execute(interaction: CommandInteraction) {
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
    .setLabel('Add tag')
    .setStyle('PRIMARY');
  const buttonRow = new MessageActionRow()
    .addComponents(
      noButton,
      yesButton,
    );

  if (tag === undefined || tag == null) {
    interaction.reply('Tag missing, please try again.');
    return;
  }

  await interaction.reply({
    content: `Are you sure you want to add ${tag.trim()}?`,
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

      await interaction.followUp({ content: errorMessage, ephemeral: true });
    }
  }
}
