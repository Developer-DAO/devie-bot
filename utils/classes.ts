import { Client, Collection } from 'discord.js';
import { AllCommands } from '../slashCommands';
import { ReadyEvent, InteractionCreateEvent } from '../events';
import { SlashCommandConfig } from '../types';

export class discordClient extends Client {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
    commands: Collection<string, SlashCommandConfig> = new Collection();

    async loadCommandsToClient() {
      for (let index = 0; index < AllCommands.length; index++) {
        const command = AllCommands[index];
        this.commands.set(command.name, command);
      }
    }

    async loadEventsToClient() {
      this.once(ReadyEvent.name, ReadyEvent.execute);
      this.on(InteractionCreateEvent.name, InteractionCreateEvent.execute);
    }
}
