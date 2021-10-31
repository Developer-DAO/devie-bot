import { Intents, Collection } from 'discord.js';
import { discordClient } from './utils/classes';
import dotenv from 'dotenv';

dotenv.config()

const botToken = process.env.DISCORD_TOKEN
const client = new discordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.commands = new Collection();
client.loadCommandsToClient();
client.loadEventsToClient();
client.login(botToken)

