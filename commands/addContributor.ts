import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isContributor, createContributor } from '../utils/index';

export const data = new SlashCommandBuilder()
    .setName('add-contributor')
    .setDescription('add yourself to the contributor list')

export async function execute(interaction: CommandInteraction) {
    if (await isContributor(interaction.user.discriminator)) {
        interaction.reply('Sorry! You can not add yourself because you are already a contributor!')
        return
    }
    await createContributor(interaction.user.id)
    interaction.reply({ content: 'You added yourself as a contributer! Congrats', ephemeral: true })
    return

}
