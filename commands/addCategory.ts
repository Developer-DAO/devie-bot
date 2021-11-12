import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { createCategory, findCategoryByName, isAirtableError } from '../utils';
import { isHandledError } from '../utils/error';

export const data = new SlashCommandBuilder()
  .setName('add-category')
  .setDescription('Adds a category to the knowledge base')
  .addStringOption(
    option => option.setRequired(true)
      .setName('category')
      .setDescription('Enter a category'))

export async function execute(interaction: CommandInteraction) {
  const category = interaction.options.getString('category')
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
    .setLabel('Add category')
    .setStyle('PRIMARY');
  const buttonRow = new MessageActionRow()
    .addComponents(
      noButton,
      yesButton,
    );

  if (category === undefined || category == null) {
    interaction.reply('Category missing, please try again.');
    return;
  }

  await interaction.reply({
    content: `Are you sure you want to add ${category.trim()}?`,
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
      content: `"${category.trim()}" was not added`,
      ephemeral: true,
    })
    return;
  }
  else {
    try {
      const foundCategory = await findCategoryByName(category.trim());
      if (foundCategory) {
        await interaction.editReply('This category is already registered.');
      }
      else {
        await createCategory(category.trim());
        await interaction.editReply('Thank you. The category has been added.');
      }
    }
    catch (e) {
      let errorMessage = 'There was an error saving. Please try again.';
      if (isAirtableError(e)) {
        errorMessage = 'There was an error from Airtable. Please try again.';
      }
      if (isHandledError(e)) {
        errorMessage = e.message;
      }

      await interaction.followUp({ content: errorMessage, ephemeral: true });
    }
  }
}
