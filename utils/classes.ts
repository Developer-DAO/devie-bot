import { Client, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { AllCommands } from '../slashCommands';
import { ReadyEvent, MessageReactionAddEvent, InteractionCreateEvent } from '../events';
import { SlashCommandConfig } from '../types';

export class discordClient extends Client {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
    commands: Collection<string, SlashCommandConfig> = new Collection();

    async loadCommandsToServer(): Promise<void> {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const rest = new REST({ version: '9' }).setToken(process!.env.DISCORD_TOKEN!)
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process!.env.GUILD_ID!), {
          body: AllCommands.map(command => command.commandJSON()),
        });
        console.log('registered / commands');
      }
      catch (error) {
        console.error(error);
      }
    }

    loadCommandsToClient() {
      for (let index = 0; index < AllCommands.length; index++) {
        const command = AllCommands[index];
        this.commands.set(command.name, command);
      }
    }

    loadEventsToClient() {
      this.once(ReadyEvent.name, ReadyEvent.execute);
      this.on(InteractionCreateEvent.name, InteractionCreateEvent.execute);
      this.on(MessageReactionAddEvent.name, MessageReactionAddEvent.execute);
    }
}
