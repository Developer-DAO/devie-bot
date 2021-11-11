import { Intents, Collection } from 'discord.js';
import { discordClient } from './utils/classes';
import dotenv from 'dotenv';

import { aggregateFeed } from './events/aggregateFeed';

dotenv.config()

const { NEWSFEED: newsfeed, AGGREGATOR: aggregator, EMOJI_ID: emoji, DISCORD_TOKEN: botToken } = process.env;
const client = new discordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

client.commands = new Collection();
client.loadCommandsToClient();
client.loadEventsToClient();
client.on('messageReactionAdd', async (reaction) => aggregateFeed(reaction, client, newsfeed, aggregator, emoji));
client.login(botToken)