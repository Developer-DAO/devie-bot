import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { createTag } from '../utils';

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
    content: `Are you sure you want to add ${tag}?`,
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
      content: `"${tag}" was not added`,
      ephemeral: true,
    })
    return;
  }
  else {
    try {
      createTag(tag);
      await interaction.editReply('Thank you. The tag has been added.');
    }
    catch (e) {
      await interaction.editReply('Unfortunately something went wrong adding the tag. Please try again later.');
    }
  }
}
