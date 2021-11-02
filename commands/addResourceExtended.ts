import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message } from 'discord.js';
import isValidUrl from '../utils/urlChecker';

import { setCategorySelection, setBlockchainSelection, setLevelSelection, setMediaTypeSelection, setTagSelection } from './menuSelections';
import { Resource } from '../types';

export const data = new SlashCommandBuilder()
    .setName('add-resource-extended')
    .setDescription('Adds your link to the knowledgebase (must be airtable link)')
    .addStringOption(
        option => option.setRequired(true)
        .setName('url')
        .setDescription('Enter a link to a resource'))

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
        await dmChannel.sendTyping();
        await dmChannel.send('Please enter more information about the article');
        const originalMessage = await dmChannel.send('Article title');

        const receivedMessages = await originalMessage.channel.awaitMessages({ filter, max: 1 })
        const titleMessage = receivedMessages.first();
        if (titleMessage) {
          newResource.title = titleMessage.content ?? ''
          originalMessage.edit(`Title: ${newResource.title}`);
        }

        const summaryRequest = await dmChannel.send('Article summary');
        const summaryMessages = await summaryRequest.channel.awaitMessages({ filter, max: 1 })
        const summaryMessage = summaryMessages.first();
        if (summaryMessage) {
          newResource.summary = summaryMessage.content ?? ''
          summaryRequest.edit(`Summary: ${newResource.summary}`);
        }

        const levelMessage = await setLevelSelection(dmChannel);
        const levelResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.level = levelResponse.values[0];
        levelMessage.edit({ content: `Level: ${newResource.level}`, components: [] });
        newResource.level = levelResponse.values[0];

        const mediaMessage = await setMediaTypeSelection(dmChannel);
        const mediaTypeResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.mediaType = mediaTypeResponse.values[0];
        mediaMessage.edit({ content: `Media: ${newResource.mediaType}`, components: [] })

        const blockchainMessage = await setBlockchainSelection(dmChannel);
        const blockchainResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.blockchain = blockchainResponse.values;
        blockchainMessage.edit({ content: `Blockchain: ${newResource.blockchain.join(', ')}`, components: [] })

        const tagsMessage = await setTagSelection(dmChannel);
        const tagsResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.tags = tagsResponse.values;
        tagsMessage.edit({ content: `Tags: ${newResource.tags.join(', ')}`, components: [] })

        const categoryMessage = await setCategorySelection(dmChannel);
        const categoryResponse = await dmChannel.awaitMessageComponent<'SELECT_MENU'>()
        newResource.category = categoryResponse.values;
        categoryMessage.edit({ content: `Categories: ${newResource.category.join(', ')}`, components: [] })

        console.log(newResource)
    }
    else {
      console.log('Something went wrong here?');
        // await interaction.reply({ content: 'Sorry, that\'s not a valid url!', ephemeral: true })
    }
}
