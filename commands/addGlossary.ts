import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { createGlossaryTerm, findGlossaryTermByName, isAirtableError } from '../utils';
import { isValidUrl } from '../utils/urlChecker';
import { isHandledError } from '../utils/error';

export const data = new SlashCommandBuilder()
  .setName('add-glossary')
  .setDescription('Adds a glossary term to the knowledge base')
  .addStringOption(
    option => option.setRequired(true)
      .setName('term')
      .setDescription('Enter a term'))
  .addStringOption(
    option => option.setRequired(true)
      .setName('description')
      .setDescription('Enter a description for the term'))
  .addStringOption(
    option => option.setRequired(true)
      .setName('website')
      .setDescription('Enter a link to a resource where people can find out more info on this term.'));

export async function execute(interaction: CommandInteraction) {
  const term = interaction.options.getString('term');
  const description = interaction.options.getString('description');
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
    .setLabel('Add term')
    .setStyle('PRIMARY');
  const buttonRow = new MessageActionRow()
    .addComponents(
      noButton,
      yesButton,
    );

  if (term === undefined || term == null) {
    interaction.reply({ content: 'Term missing, please try again.', ephemeral: true });
    return;
  }

  if (description === undefined || description == null) {
    interaction.reply({ content: 'Description missing, please try again.', ephemeral: true });
    return;
  }

  if (website === undefined || website == null || !isValidUrl(website.trim())) {
    interaction.reply({ content: 'Website missing or invalid link, please try again.', ephemeral: true });
    return;
  }

  await interaction.reply({
    content: `Are you sure you want to add \`${term.trim()}\`?`,
    components: [buttonRow],
    ephemeral: true,
  });

  const interactionMessage = await interaction.fetchReply();

  if (interactionMessage instanceof Message) {
    const buttonReply = await interaction.channel?.awaitMessageComponent({ componentType: 'BUTTON' });
    if (!buttonReply) {
      return;
    }

    const buttonSelected = buttonReply.customId;
    buttonReply.update({ components: [] });
    if (buttonSelected === REPLY.NO) {
      buttonReply.followUp({
        content: `"${term.trim()}" was not added`,
        ephemeral: true,
      })
      return;
    }
    else {
      try {
        const foundChain = await findGlossaryTermByName(term.trim());
        if (foundChain) {
          await interaction.editReply('This term is already registered.');
        }
        else {
          await createGlossaryTerm(term.trim(), description.trim(), website.trim());
          await interaction.editReply('Thank you. The term has been added.');
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
          console.log('Error trying to follow up add-glossary', e);
        }
      }
    }
  }
}
