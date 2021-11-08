export const name = 'interactionCreate';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function execute(interaction: any) {
    if (!interaction.isCommand() && !interaction.isButton()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;
    try {
        await command.execute(interaction)
    }
    catch (error) {
        console.error(error)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
}
