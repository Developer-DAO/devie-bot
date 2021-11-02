import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('add-tag')
    .setDescription('Adds a tag to the knowledgebase')
    .addStringOption(
      option => option.setRequired(true)
      .setName('tag')
      .setDescription('Enter a tag'))

export async function execute(interaction: CommandInteraction) {
  console.log('Add tag interaction started')
  const userInput = interaction.options.getString('tag')
  const validAnswers = ['y', 'n']
  const filter = (response: Message) => {
    return validAnswers.some(answer => answer.toLowerCase() === response.content.toLowerCase()) && response.author.id === interaction.user.id
  }

  await interaction.reply({
      content: `you are submiting ${userInput} as a new resource. \n Is this tag correct? [Y/N]`,
      ephemeral: true,
  })

  const collector = await interaction.channel?.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] })
  console.log('Recieved interaction')
  collector?.map((message: Message) => {
    console.log(message);
    switch (message.content.toLowerCase()) {
      case 'y':
        interaction.followUp({
          content: 'Confirmed!',
          ephemeral: true,
        });
        console.log(`Saving ${userInput} to the Tags table`);
        break;
      case 'n':
          interaction.followUp({
              content: 'Try again with the correct resource please!',
              ephemeral: true,
          })
          break;
      default:
          break;
    }
  })
}
