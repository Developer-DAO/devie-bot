import { SlashCommandBuilder, inlineCode } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { createResource, findContributor, isContributor, isValidUrl, readAuthors, readBlockchain, readCategory, readTags, ResourceBuilder } from '../utils/index';

export const data = new SlashCommandBuilder()
  .setName('add-resource')
  .setDescription('Adds a resource to the Developer DAO knowledge base')
  .addStringOption(
    option => option.setRequired(true)
      .setName('url')
      .setDescription('Enter a link to a resource'))
  .addStringOption(
    option => option.setRequired(true)
      .setName('title')
      .setDescription('Enter the resource title'))
  .addStringOption(
    option => option.setRequired(true)
      .setName('summary')
      .setDescription('Enter the resource summary'))
  .addStringOption(option =>
    option.setName('level')
      .setDescription('The resource level')
      .setRequired(true)
      .addChoice('Beginner', 'Beginner')
      .addChoice('Intermediate', 'Intermediate')
      .addChoice('Advanced', 'Advanced'))
  .addStringOption(option =>
    option.setName('media')
      .setDescription('Media type')
      .setRequired(true)
      .addChoice('Article', 'Article')
      .addChoice('Video', 'Video')
      .addChoice('Paid Course', 'Paid Course')
      .addChoice('Free Course', 'Free Course'));

function getSanitizedResourceInfo(interaction: CommandInteraction): ResourceBuilder {
  const source = interaction.options.getString('url') ?? '';
  const title = interaction.options.getString('title') ?? '';
  const summary = interaction.options.getString('summary') ?? '';
  const level = interaction.options.getString('level') ?? '';
  const mediaType = interaction.options.getString('media') ?? '';

  const builder = new ResourceBuilder();
  builder.title = title;
  builder.source = source;
  builder.summary = summary;
  builder.level = level;
  builder.mediaType = mediaType;

  return builder;
}

function buildEmbed(resource: ResourceBuilder) {
  const resourceEmbed = new MessageEmbed().setColor('#0099ff');
  resourceEmbed.setAuthor(resource.author ? resource.author.name : 'Author');
  resourceEmbed.setTitle(resource.title ?? 'Title');
  resourceEmbed.setURL(resource.source ?? 'Source');
  resourceEmbed.setDescription(resource.summary ?? 'Summary');

  const blockChains = resource.blockchain && resource.blockchain.length > 0 ? resource.blockchain.map(b => b.name).join(', ') : 'Blockchain';
  const categories = resource.category && resource.category.length > 0 ? resource.category.map(c => c.name).join(', ') : 'Category';
  const tags = resource.tags && resource.tags.length > 0 ? resource.tags.map(t => t.name).join(', ') : 'Tags';

  resourceEmbed.setFields([
    { name: 'level', value: resource.level ?? 'Level', inline: true },
    { name: 'mediatype', value: resource.mediaType ?? 'Media Type', inline: true },
    { name: 'blockchain', value: blockChains, inline: false },
    { name: 'category', value: categories, inline: true },
    { name: 'tags', value: tags, inline: true },
  ]);
  return resourceEmbed;
}

export async function execute(interaction: CommandInteraction) {
  let contributor;
  if (!await isContributor(interaction.user)) {
    await interaction.reply(`it looks like you are not a contributor yet!\nPlease add yourself using: ${inlineCode('/add-contributor')}`)
    return
  }
  else {
    const contributorResponse = await findContributor(interaction.user);
    if (contributorResponse) {
      contributor = contributorResponse.getId();
    }
  }

  const url = interaction.options.getString('url');
  if (url && !isValidUrl(url)) {
    interaction.reply('Invalid URL provided, please check it before submitting again.');
    return;
  }
  const resource = getSanitizedResourceInfo(interaction);
  resource.contributor = contributor;

  const resourceEmbed = buildEmbed(resource);
  const tags = await readTags();
  const tagsOptions = tags.map(tag => ({ label: tag.name, value: tag.id }));
  const tagsRow = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('tags')
      .setPlaceholder('Select tags')
      .setMaxValues(Math.min(tagsOptions.length, 25))
      .addOptions(tagsOptions),
  );

  const blockchain = await readBlockchain();
  const bcOptions = blockchain.map(bc => ({ label: bc.name, value: bc.id }));
  const bcRow = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('blockchain')
      .setPlaceholder('Select blockchain')
      .setMaxValues(Math.min(bcOptions.length, 25))
      .addOptions(bcOptions),
  );

  const categories = await readCategory();
  const categoryOptions = categories.map(category => ({ label: category.name, value: category.id }));
  const categoryRow = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('category')
      .setPlaceholder('Select categories')
      .setMaxValues(Math.min(categoryOptions.length, 25))
      .addOptions(categoryOptions),
  );

  const authors = await readAuthors();
  const authorOptions = authors.map(author => ({ label: author.name, value: author.id }));
  const authorRow = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('author')
      .setPlaceholder('Select author')
      .addOptions(authorOptions),
  );

  const selectionRows = [authorRow, bcRow, categoryRow, tagsRow];

  await interaction.reply({
    embeds: [resourceEmbed],
    content: 'Tell me about the resource',
    components: selectionRows,
    ephemeral: true,
  });

  const collector = interaction.channel?.createMessageComponentCollector({
    maxComponents: 4,
    time: 60_000,
    componentType: 'SELECT_MENU',
  });

  collector?.on('collect', (menuInteraction) => {
    switch (menuInteraction.customId) {
      case 'category': {
        resource.category = menuInteraction.values.map(v => {
          const lookupItem = categories.find((value) => value.id === v);
          return lookupItem ?? { name: 'Unknown', id: v };
        });
        break;
      }
      case 'tags': {
        resource.tags = menuInteraction.values.map(v => {
          const lookupItem = tags.find((value) => value.id === v);
          return lookupItem ?? { name: 'Unknown', id: v };
        });
        break;
      }
      case 'blockchain': {
        resource.blockchain = menuInteraction.values.map(v => {
          const lookupItem = blockchain.find((value) => value.id === v);
          return lookupItem ?? { name: 'Unknown', id: v };
        });
        break;
      }
      case 'author': {
        resource.author = menuInteraction.values.map(v => {
          const lookupItem = authors.find((value) => value.id === v);
          return lookupItem ?? { name: 'Unknown', id: v };
        })[0];
        break;
      }
    }

    const menuRows = [];

    if (resource.author === undefined) {
      menuRows.push(authorRow);
    }
    if (resource.blockchain === undefined || resource.blockchain.length === 0) {
      menuRows.push(bcRow);
    }
    if (resource.category === undefined || resource.category.length === 0) {
      menuRows.push(categoryRow);
    }
    if (resource.tags === undefined || resource.tags.length === 0) {
      menuRows.push(tagsRow);
    }

    const updatedEmbed = buildEmbed(resource);
    menuInteraction.update({ components: menuRows })
    interaction.editReply({ embeds: [updatedEmbed] });
  });

  collector?.on('end', async () => {
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
      .setLabel('Add resource')
      .setStyle('PRIMARY');
    const buttonRow = new MessageActionRow()
      .addComponents(
        noButton,
        yesButton,
      );

    await interaction.editReply({
      components: [buttonRow],
    });

    const buttonReply = await interaction.channel?.awaitMessageComponent({ componentType: 'BUTTON' });
    if (!buttonReply) {
      return;
    }

    const buttonSelected = buttonReply.customId;
    buttonReply.update({ embeds: [resourceEmbed], components: [] });
    if (buttonSelected === REPLY.NO) {
      buttonReply.followUp({
        content: `"${resource.title}" was not added`,
        ephemeral: true,
      })
      return;
    }
    else {
      const result = await createResource(resource.build());
      if (result.success) {
        interaction.editReply({
          content: 'Resource was added. Thank you for your contribution',
          embeds: [],
          components: [],
        });
      }
      else {
        interaction.editReply({
          content: 'Resource addition failed. ${error}',
          embeds: [],
          components: [],
        });
      }
    }
  })
}
