import { SlashCommandBuilder, inlineCode } from '@discordjs/builders';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import { ResourceBuilder, isContributor, isValidUrl } from '../utils/index';
import { setCategorySelection, setBlockchainSelection, setLevelSelection, setMediaTypeSelection, setTagSelection } from './menuSelections';

export const data = new SlashCommandBuilder()
    .setName('add-resource-extended')
    .setDescription('Adds your link to the knowledgebase (must be airtable link)')
    .addStringOption(
        option => option.setRequired(true)
        .setName('url')
        .setDescription('Enter a link to a resource'));

function ConfigureEmbed(embed: MessageEmbed, resource: ResourceBuilder): MessageEmbed {
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

function UpdateEmbed(embed: MessageEmbed, embedMessage: Message, resource: ResourceBuilder): void {
  const updatedEmbed = ConfigureEmbed(new MessageEmbed(embed), resource);
  embedMessage.edit({ embeds: [updatedEmbed] })
}

export async function execute(interaction: CommandInteraction) {
  if (!await isContributor(interaction.user.id)) {
    await interaction.reply(`it looks like you are not a contributor yet!\nPlease add yourself using: ${inlineCode('/add-contributor')}`)
    return
  }
  const userInput = interaction.options.getString('url')
  if (userInput === undefined || userInput == null) {
      return;
    }

    // TODO: Lookup the user's discord ID in AirTable and see if they are already a contributor
    // TODO: Ask the user for their NFT ID if they have not contributed before

    if (isValidUrl(userInput)) {
        const newResource = new ResourceBuilder();
        newResource.source = userInput;
        const filter = (m: Message) => interaction.user.id === m.author.id;
        await interaction.reply({ content: 'Please complete the addition process in the DM you just received', ephemeral: true });
        const dmChannel = await interaction.user.createDM();

        await dmChannel.send('Please enter more information about the article');

        // TODO: Work out how to add an Author
        newResource.author = 'Testing'

        // TODO: Work out how to add a Contributor
        newResource.contributor = 'Testing'

        const resourceEmbed = ConfigureEmbed(new MessageEmbed(), newResource);
        const embedMessage = await dmChannel.send({ embeds: [resourceEmbed] });
        const originalMessage = await dmChannel.send('Article title');
        const receivedMessages = await originalMessage.channel.awaitMessages({ filter, max: 1 })
        const titleMessage = receivedMessages.first();
        if (titleMessage) {
          newResource.title = titleMessage.content ?? ''
          originalMessage.delete();
          UpdateEmbed(resourceEmbed, embedMessage, newResource);
        }

        const summaryRequest = await dmChannel.send('Article summary');
        const summaryMessages = await summaryRequest.channel.awaitMessages({ filter, max: 1 })
        const summaryMessage = summaryMessages.first();
        if (summaryMessage) {
          newResource.summary = summaryMessage.content ?? ''
          summaryRequest.delete();
          UpdateEmbed(resourceEmbed, embedMessage, newResource);
        }

        const levelMessage = await setLevelSelection(dmChannel);
        const levelResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>();
        newResource.level = levelResponse.values[0];
        levelMessage.delete();
        newResource.level = levelResponse.values[0];
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const mediaMessage = await setMediaTypeSelection(dmChannel);
        const mediaTypeResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>();
        newResource.mediaType = mediaTypeResponse.values[0];
        mediaMessage.delete();
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const blockchainMessage = await setBlockchainSelection(dmChannel);
        const blockchainResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>();
        newResource.blockchain = blockchainResponse.values;
        blockchainMessage.delete();
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const tagsMessage = await setTagSelection(dmChannel);
        const tagsResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>();
        newResource.tags = tagsResponse.values;
        tagsMessage.delete();
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        const categoryMessage = await setCategorySelection(dmChannel);
        const categoryResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>();
        newResource.category = categoryResponse.values;
        categoryMessage.delete();
        UpdateEmbed(resourceEmbed, embedMessage, newResource);

        console.log(newResource.build());
        // TODO: Send this to AirTable
    }
    else {
      await interaction.reply({ content: 'Invalid URL! Please try again.', ephemeral: true })
      return
    }
}
