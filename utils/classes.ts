import { Client } from 'discord.js';
import fs from 'fs';

export class discordClient extends Client {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any

    async loadCommandsToClient() {
        console.log('Loading commands', `${__dirname}/../commands`);
        // Loading both ts and js to make sure it works after building
        const commandFiles = fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            console.log('Loading command file', `${__dirname}/../commands/${file}`);
            const command = await import(`${__dirname}/../commands/${file}`);
            this.commands.set(command.data.name, command)
        }
    }

    async loadEventsToClient() {
        console.log('Loading events', `${__dirname}/../events`);
        // Loading both ts and js to make sure it works after building
        const eventFiles = fs.readdirSync(`${__dirname}/../events`).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of eventFiles) {
            console.log('Loading event file', `${__dirname}/../events/${file}`);
            const event = await import(`${__dirname}/../events/${file}`);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args))
            }
            else {
                this.on(event.name, (...args) => event.execute(...args))
            }
        }
    }
}
