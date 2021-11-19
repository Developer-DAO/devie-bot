/* eslint-disable no-undef */
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import dotenv from 'dotenv'

dotenv.config()

import { AllCommands } from './slashCommands';

const commands: RESTPostAPIApplicationCommandsJSONBody[] = []
for (let index = 0; index < AllCommands.length; index++) {
  const command = AllCommands[index];
  commands.push(command.commandJSON());
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
