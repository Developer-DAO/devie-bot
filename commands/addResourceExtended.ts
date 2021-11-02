import { Embed, SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, DMChannel, Message, MessageEmbed } from 'discord.js';
import isValidUrl from '../utils/urlChecker';

import { setCategorySelection, setBlockchainSelection, setLevelSelection, setMediaTypeSelection, setTagSelection } from './menuSelections';
import { Resource } from '../types';

export const data = new SlashCommandBuilder()
    .setName('add-resource-extended')
    .setDescription('Adds your link to the knowledgebase (must be airtable link)')
    .addStringOption(
        option => option.setRequired(true)
        .setName('url')
        .setDescription('Enter a link to a resource'));

function ConfigureEmbed(embed: MessageEmbed, resource: Resource): MessageEmbed {
  embed.setAuthor(resource.author ?? 'Author');
  embed.setTitle(resource.title ?? 'Title');
  embed.setURL(resource.source ?? 'Source');
  embed.setDescription(resource.summary ?? 'Summary');
  embed.setFields([
    { name: 'level', value: resource.level ?? 'Level', inline: true },
    { name: 'mediatype', value: resource.mediaType ?? 'Media Type', inline: true },
    { name: 'blockchain', value: resource.blockchain ? resource.blockchain.join(', ') : 'Blockchain', inline: false },
    { name: 'category', value: resource.category ? resource.category.join(', ') : 'Category', inline: true },
    { name: 'tags', value: resource.tags ? resource.tags.join(', ') : 'Tags', inline: true },
  ]);

  return embed;
}

function UpdateEmbed(embed: MessageEmbed, embedMessage: Message, resource: Resource): void {
  const updatedEmbed = ConfigureEmbed(new MessageEmbed(embed), resource);
  embedMessage.edit({ embeds: [updatedEmbed] })
}

export async function execute(interaction: CommandInteraction) {
    const userInput = interaction.options.getString('url')
    if (userInput === undefined || userInput == null) {
      return;
    }

    const newResource = new Resource();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (isValidUrl(userInput)) {
        newResource.source = userInput;
        const filter = (m: Message) => interaction.user.id === m.author.id;
        await interaction.reply('Please complete the addition process in the DM you just received');
        const dmChannel = await interaction.user.createDM();

        await dmChannel.send('Please enter more information about the article');

        const resourceEmbed = ConfigureEmbed(new MessageEmbed(), newResource);
        const embedMessage = await dmChannel.send({ embeds: [resourceEmbed] });
        const originalMessage = await dmChannel.send('Article title');
        const receivedMessages = await originalMessage.channel.awaitMessages({ filter, max: 1 })
        const titleMessage = receivedMessages.first();
        if (titleMessage) {
          newResource.title = titleMessage.content ?? ''
          // originalMessage.edit(`Title: ${newResource.title}`);
          originalMessage.delete();
          UpdateEmbed(resourceEmbed, embedMessage, newResource);
        }

        const summaryRequest = await dmChannel.send('Article summary');
        const summaryMessages = await summaryRequest.channel.awaitMessages({ filter, max: 1 })
        const summaryMessage = summaryMessages.first();
        if (summaryMessage) {
          newResource.summary = summaryMessage.content ?? ''
          // summaryRequest.edit(`Summary: ${newResource.summary}`);
          summaryRequest.delete();
          UpdateEmbed(resourceEmbed, embedMessage, newResource);
        }

        const levelMessage = await setLevelSelection(dmChannel);
        const levelResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.level = levelResponse.values[0];
        // levelMessage.edit({ content: `Level: ${newResource.level}`, components: [] });
        levelMessage.delete();
        newResource.level = levelResponse.values[0];
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const mediaMessage = await setMediaTypeSelection(dmChannel);
        const mediaTypeResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.mediaType = mediaTypeResponse.values[0];
        // mediaMessage.edit({ content: `Media: ${newResource.mediaType}`, components: [] })
        mediaMessage.delete();
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const blockchainMessage = await setBlockchainSelection(dmChannel);
        const blockchainResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.blockchain = blockchainResponse.values;
        // blockchainMessage.edit({ content: `Blockchain: ${newResource.blockchain.join(', ')}`, components: [] })
        blockchainMessage.delete();
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const tagsMessage = await setTagSelection(dmChannel);
        const tagsResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.tags = tagsResponse.values;
        // tagsMessage.edit({ content: `Tags: ${newResource.tags.join(', ')}`, components: [] })
        tagsMessage.delete();
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const categoryMessage = await setCategorySelection(dmChannel);
        const categoryResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.category = categoryResponse.values;
        // categoryMessage.edit({ content: `Categories: ${newResource.category.join(', ')}`, components: [] })
        categoryMessage.delete();
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        console.log(newResource)
    }
    else {
      console.log('Something went wrong here?');
        // await interaction.reply({ content: 'Sorry, that\'s not a valid url!', ephemeral: true })
    }
}
