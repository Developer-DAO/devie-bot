import { MessageReaction, PartialMessageReaction, TextChannel } from 'discord.js';
import { MessageReactionAddEventConfig } from '../types';

const { CURATE_FROM, POST_TO, POST_THRESHOLD } = process.env;
if (CURATE_FROM === undefined) {
  throw new Error('Bot cannot function properly without `CURATE_FROM` being set.');
}

if (POST_TO === undefined) {
  throw new Error('Bot cannot function properly without `POST_TO` being set.');
}

if (POST_THRESHOLD === undefined) {
  throw new Error('Bot cannot function properly without `POST_THRESHOLD` being set.');
}

const channelIds = CURATE_FROM.split(',');

export const MessageReactionAddEvent: MessageReactionAddEventConfig = {
  name: 'messageReactionAdd',
  once: false,
  execute: async (reaction: MessageReaction | PartialMessageReaction) => {
    try {
      console.log(reaction)
      // When a reaction is received, check if the structure is partial
      if (reaction.partial) {
        await reaction.fetch();
      }

      const { message, emoji, count } = reaction;
      const { channelId, author } = message;

      const sendMessage = () => {
        return channelIds.includes(channelId) && emoji.name === '📰' && count === parseInt(POST_THRESHOLD, 10);
      };

      if (sendMessage()) {
        const channel = reaction.client.channels.cache.get(POST_TO) as TextChannel;
        if (channel) {
          const authorName = author ? author.username : 'unknown';
          const formattedMessage = `This post received ${POST_THRESHOLD} 📰 reactions and will be considered for the newsletter! (Shared by @${authorName})\n${message.content}`;
          channel.send(formattedMessage);
        }
      }
    }
    catch (error) {
      console.error('Something went wrong when fetching the message:', error);
      return;
    }
  },
}
