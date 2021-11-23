import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { CommandInteraction } from 'discord.js';

export interface SlashCommandConfig {
  name: string;
  roles: string[];
  commandJSON: () => RESTPostAPIApplicationCommandsJSONBody;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
