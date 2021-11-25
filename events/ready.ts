import { Client } from 'discord.js';

export const name = 'ready';
export const once = true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function execute(client: Client) {
  if (client.user) {
    client.user.setActivity('gas fees going up', { type: 'WATCHING' });
    client.user.setStatus('online');
    console.log(`Ready! Logged in as ${client.user.tag}`);
  }
}
