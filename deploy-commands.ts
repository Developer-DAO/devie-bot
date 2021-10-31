/* eslint-disable no-undef */
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';

const commands: SlashCommandBuilder[] = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));
    (async () => {
        for (const file of commandFiles) {
            const command = await import(`./commands/${file}`);
            commands.push(command.data.toJSON())
        }
        const rest = new REST({ version: '9' }).setToken('OTAzNDk2MzQwMzUxMzczMzUy.YXt0iQ.jYWVsZ1r_-ajmlaBa-0eAeabpXQ')
        try {
            rest.put(Routes.applicationGuildCommands('903496340351373352', '904099881323487253'), { body: commands })
                .then(()=> console.log('registered / commands'))
                .catch(console.error)
        }
        catch { console.error }
    })();
