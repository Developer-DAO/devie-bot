import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Author as AuthorInfo } from '../types';
import { createAuthor, isAirtableError } from '../utils/airTableCalls';
import HandledError, { isHandledError } from '../utils/error';
import { createTwitterHandle } from '../utils/twitterHandle';
import { isValidUrl } from '../utils/urlChecker';

export const data = new SlashCommandBuilder()
  .setName('add-author')
  .setDescription('Adds an author to the knowledgebase')
  .addStringOption(
    option => option.setRequired(true)
      .setName('author')
      .setDescription('Enter the author full name'),
  )
  .addBooleanOption(option =>
    option.setRequired(true)
      .setName('is_dao_member')
      .setDescription('Are they a Developer DAO member?'),
  )
  .addStringOption(
    option => option.setRequired(false)
      .setName('twitter_url')
      .setDescription('Enter their Twitter URL'),
  )
  .addStringOption(
    option => option.setRequired(false)
      .setName('youtube_url')
      .setDescription('Enter their YouTube URL'),
  );


function getSanitizedAuthorInfo(interaction: CommandInteraction): AuthorInfo {
  const authorName = interaction.options.getString('author');
  const isDaoMember = interaction.options.getBoolean('is_dao_member');
  const twitterUrl = interaction.options.getString('twitter_url');
  const youtubeUrl = interaction.options.getString('youtube_url');

  if (authorName === null || isDaoMember === null) {
    // The discord bot *should* handle this, but just in case.
    throw new HandledError('Missing required fields');
  }

  return {
    name: authorName,
    isDaoMember,
    twitterUrl: twitterUrl || '',
    youtubeUrl: youtubeUrl || '',
  }
}

export async function execute(interaction: CommandInteraction) {
  const REPLY = {
    YES: 'yes',
    NO: 'no',
  };

  const author = getSanitizedAuthorInfo(interaction);
  const { name, isDaoMember, youtubeUrl } = author;
  let { twitterUrl } = author;

  const invalidUrlType = [];

  if (twitterUrl !== '') {
    const twitterResponse = createTwitterHandle(twitterUrl);
    if (twitterResponse.isValid) {
      twitterUrl = twitterResponse.URL;
      author.twitterUrl = twitterUrl;
    }
    else {
      invalidUrlType.push(`Twitter URL (${twitterUrl})`);
    }
  }

  if (youtubeUrl !== '' && !isValidUrl(youtubeUrl)) {
    invalidUrlType.push(`YouTube URL (${youtubeUrl})`);
  }

  if (invalidUrlType.length > 0) {
    await interaction.reply({
      content: `Invalid ${invalidUrlType.join(' and')}`,
      ephemeral: true,
    });
    return;
  }

  const blankSpaceField = '\u200b';
  const authorEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Add author?')
    .setDescription('Please review the information.')
    .addField(blankSpaceField, blankSpaceField)
    .addFields(
      { name: 'Name', value: name },
      { name: 'Author is Dao Member?', value: `${isDaoMember ? 'Yes' : 'No'}` },
      { name: 'Twitter URL', value: `${twitterUrl === '' ? 'Not provided' : twitterUrl}` },
      { name: 'Youtube URL', value: `${youtubeUrl === '' ? 'Not provided' : youtubeUrl}` },
    )
    .addField(blankSpaceField, blankSpaceField)
    .setTimestamp();

  const noButton = new MessageButton()
    .setCustomId(REPLY.NO)
    .setLabel('No, cancel')
    .setStyle('DANGER');
  const yesButton = new MessageButton()
    .setCustomId(REPLY.YES)
    .setLabel('Yes, add author')
    .setStyle('PRIMARY');
  const buttonRow = new MessageActionRow()
    .addComponents(
      noButton,
      yesButton,
    );

  await interaction.reply({
    embeds: [authorEmbed],
    components: [buttonRow],
    ephemeral: true,
  });

  const buttonReply = await interaction.channel?.awaitMessageComponent({ componentType: 'BUTTON' });
  if (!buttonReply) {
    return;
  }

  const buttonSelected = buttonReply.customId;
  buttonReply.update({ embeds: [authorEmbed], components: [] });
  if (buttonSelected === REPLY.NO) {
    buttonReply.followUp({
      content: `"${name}" was not added`,
      ephemeral: true,
    })
    return;
  }

  try {
    await createAuthor(author);
    await interaction.followUp({ content: `"${name}" was added as an author`, ephemeral: true });
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
