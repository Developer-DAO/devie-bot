import { GuildMemberRoleManager, Interaction } from 'discord.js';
import { discordClient } from '../utils';
import { IInteractionCreateEventConfig } from '../types';

export const InteractionCreateEvent: IInteractionCreateEventConfig = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction: Interaction) => {
    if (!interaction.isCommand() || interaction.user.bot) return;

    if (interaction.client instanceof discordClient) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;
      try {
          if (command.roles.length > 0) {
            if (interaction.member.roles instanceof GuildMemberRoleManager) {
              const hasRole = interaction.member.roles.cache.some(role => command.roles.includes(role.name.toLowerCase()));
              if (!hasRole) {
                return await interaction.reply({ content: 'You do not have permission to execute this command!', ephemeral: true });
              }
            }
            else {
              const hasRole = interaction.member.roles.some((role) => command.roles.includes(role.toLowerCase()));
              if (!hasRole) {
                return await interaction.reply({ content: 'You do not have permission to execute this command!', ephemeral: true });
              }
            }
          }
          await command.execute(interaction)
          console.log(`${interaction.user.tag} triggered an interaction.`);
      }
      catch (error) {
          console.error(error)
          try {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
          }
          catch (e) {
            console.error(e);
          }
      }
    }
  },
}
