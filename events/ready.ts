import { Client } from 'discord.js';
import { ReadyEventConfig } from '../types';

export const name = 'ready';
export const once = true;

export const ReadyEvent: ReadyEventConfig = {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    if (client.user) {
      client.user.setActivity('gas fees going up', { type: 'WATCHING' });
      client.user.setStatus('online');
      console.log(`Ready! Logged in as ${client.user.tag}`);
    }
  },
}
