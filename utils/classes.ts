import { Client, Collection } from 'discord.js';
import { AllCommands } from '../slashCommands';
import { AllEvents } from '../events';
import { ISlashCommandConfig } from '../types';

export class discordClient extends Client {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
    commands: Collection<string, ISlashCommandConfig> = new Collection();

    async loadCommandsToClient() {
      for (let index = 0; index < AllCommands.length; index++) {
        const command = AllCommands[index];
        this.commands.set(command.name, command);
      }
    }

    async loadEventsToClient() {
      for (let index = 0; index < AllEvents.length; index++) {
        const event = AllEvents[index];
        if (event.once) {
          this.once(event.name, event.execute)
        }
        else {
          this.on(event.name, event.execute)
        }
      }
    }
}
