import { Message } from 'discord.js';

export const name = 'messageCreate';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function execute(interaction: Message) {
    if (!interaction.author.bot) {
        console.log(interaction)
        interaction.reply(interaction.toString())
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const command = interaction.client.commands.get(interaction.commandName);
        console.log(command)

        if (!command) return;
        try {
            await command.execute(interaction)
        }
        catch (error) {
            console.error(error)
            await interaction.author.send('There was an error while executing this command!')
        }
    }
}