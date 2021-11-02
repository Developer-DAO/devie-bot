import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isContributor } from '../utils/airTableCalls';

export const data = new SlashCommandBuilder()
    .setName('add-contributor')
    .setDescription('add yourself to the contributor list')

export async function execute(interaction: CommandInteraction) {
    if (isContributor(interaction.user.discriminator)) {
        interaction.reply('Sorry! You can not add yourself because you are already a contributor!')
        return
    }
    // add some shit here to add someone as a contributor
}