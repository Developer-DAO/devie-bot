/* eslint-disable no-undef */
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv'

dotenv.config()

import { AllCommands } from './slashCommands';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rest = new REST({ version: '9' }).setToken(process!.env.DISCORD_TOKEN!)
try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process!.env.GUILD_ID!), {
      body: AllCommands.map(command => command.commandJSON()),
    })
      .then(() => console.log('registered / commands'))
      .catch(console.error)
}
catch { console.error }
