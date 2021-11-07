import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { createCategory } from '../utils';

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
    content: `Are you sure you want to add ${category}?`,
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
      content: `"${category}" was not added`,
      ephemeral: true,
    })
    return;
  }
  else {
    try {
      await createCategory(category);
      await interaction.editReply('Thank you. The category has been added.');
    }
    catch (e) {
      await interaction.editReply('Unfortunately something went wrong adding the category. Please try again later.');
    }
  }
}
