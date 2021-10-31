import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import isValidUrl from '../utils/urlChecker';

export const data = new SlashCommandBuilder()
    .setName('add-resource')
    .setDescription('Adds your link to the knowledgebase (must be airtable link)')
    .addStringOption(
        option => option.setRequired(true)
        .setName('input')
        .setDescription('Enter a link to a resource'))

export async function execute(interaction: CommandInteraction) {
    const userInput = interaction.options.getString('input')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (isValidUrl(userInput!)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        console.log(interaction.channel)
        await interaction.user.send(`this is the link you sent: ${userInput} is this the right link?`)
    }
    else {
        await interaction.reply({ content: 'Sorry, that\'s not a valid url!', ephemeral: true })
    }
}