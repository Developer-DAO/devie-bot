import { SlashCommandBuilder, inlineCode } from '@discordjs/builders';
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { LookupItem } from '../types';
import { isHandledError } from '../utils/error';
import { createResource, findContributor, findResourceByUrl, isAirtableError, isContributor, isValidUrl, readAuthors, readBlockchain, readCategory, readTags, ResourceBuilder } from '../utils/index';

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

function buildSelectionResponse(title: string, selections?: LookupItem[]): string {
  if (selections && selections.length > 0) {
    if (selections.filter(bc => bc.id.toLowerCase() === 'n/a').length > 0) {
      return 'SKIPPED';
    }
    else {
      return selections.map(b => b.name).join(', ');
    }
  }
  else {
    return title;
  }
}

function buildEmbed(resource: ResourceBuilder) {
  const resourceEmbed = new MessageEmbed().setColor('#0099ff');
  resourceEmbed.setAuthor(resource.author ? resource.author.name : 'Author');
  resourceEmbed.setTitle(resource.title ?? 'Title');
  resourceEmbed.setURL(resource.source ?? 'Source');
  resourceEmbed.setDescription(resource.summary ?? 'Summary');

  const blockChains = buildSelectionResponse('Blockchain', resource.blockchain);
  const categories = buildSelectionResponse('Categories', resource.category);
  const tags = buildSelectionResponse('Tags', resource.tags);

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
  if (!url) {
    interaction.reply({ content: 'URL required, please try submitting again.', ephemeral: true });
    return;
  }

  if (!isValidUrl(url)) {
    interaction.reply({ content: 'Invalid URL provided, please check it before submitting again.', ephemeral: true });
    return;
  }

  const foundResouce = await findResourceByUrl(url);
  if (foundResouce) {
    interaction.reply({ content: 'A resource with this URL already exists.', ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const resource = getSanitizedResourceInfo(interaction);
  resource.contributor = contributor;

  const resourceEmbed = buildEmbed(resource);
  const tags = await readTags();
  tags.unshift({ name: '<SKIP>', id: 'N/A' });
  const tagsOptions = tags.map(tag => ({ label: tag.name, value: tag.id }));
  const tagsRow = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('tags')
      .setPlaceholder('Select tags')
      .setMaxValues(Math.min(tagsOptions.length, 25))
      .addOptions(tagsOptions),
  );

  const blockchain = await readBlockchain();
  blockchain.unshift({ name: '<SKIP>', id: 'N/A' });
  const blockchainOptions = blockchain.map(bc => ({ label: bc.name, value: bc.id }));
  const blockchainRow = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('blockchain')
      .setPlaceholder('Select blockchain')
      .setMaxValues(Math.min(blockchainOptions.length, 25))
      .addOptions(blockchainOptions),
  );

  const categories = await readCategory();
  categories.unshift({ name: '<SKIP>', id: 'N/A' });
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

  const selectionRows = [authorRow, blockchainRow, categoryRow, tagsRow];

  await interaction.editReply({
    embeds: [resourceEmbed],
    content: 'Tell me about the resource',
    components: selectionRows,
  });

  const collector = interaction.channel?.createMessageComponentCollector({
    maxComponents: 5,
    time: 120_000,
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
        if (menuInteraction.values.length === 1) {
          const selectedItemId = menuInteraction.values[0];
          const lookupItem = authors.find((value) => value.id === selectedItemId);
          resource.author = lookupItem ?? { name: 'Unknown', id: selectedItemId };
        }
        else {
          // No idea how you would get here really or what to do
        }
        break;
      }
    }

    const menuRows = [];

    if (resource.author === undefined) {
      menuRows.push(authorRow);
    }
    if (resource.blockchain === undefined || resource.blockchain.length === 0) {
      menuRows.push(blockchainRow);
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

    if (menuRows.length === 0) {
      collector?.stop();
    }
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
      try {
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
  })
}
