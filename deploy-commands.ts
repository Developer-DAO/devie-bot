/* eslint-disable no-undef */
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv'
import fs from 'fs';

dotenv.config()

const commands: SlashCommandBuilder[] = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));
    (async () => {
        for (const file of commandFiles) {
            const command = await import(`./commands/${file}`);
            commands.push(command.data.toJSON())
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const rest = new REST({ version: '9' }).setToken(process!.env.DISCORD_TOKEN!)
        try {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process!.env.GUILD_ID!), { body: commands })
                .then(() => console.log('registered / commands'))
                .catch(console.error)
        }
        catch { console.error }
    })();
