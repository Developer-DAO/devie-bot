import { Client } from 'discord.js';
import fs from 'fs';

export class discordClient extends Client {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any

    async loadCommandsToClient() {
        const commandFiles = fs.readdirSync('././commands').filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
                const command = await import(`../commands/${file}`);
                this.commands.set(command.data.name, command)
        }
    }

    async loadEventsToClient() {
        const eventFiles = fs.readdirSync('././events').filter(file => file.endsWith('.ts'));
        for (const file of eventFiles) {
            const event = await import(`../events/${file}`);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args))
            }
            else {
                this.on(event.name, (...args) => event.execute(...args))
            }
        }

    }
}