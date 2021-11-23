import { ClientEvents } from 'discord.js';

export interface EventConfig<K extends keyof ClientEvents> {
  name: K,
  once: boolean,
  execute: (...args: ClientEvents[K]) => Promise<void>
}

export interface ReadyEventConfig extends EventConfig<'ready'> {
  name: 'ready',
  once: true,
  execute: (...args: ClientEvents['ready']) => Promise<void>
}

export interface InteractionCreateEventConfig extends EventConfig<'interactionCreate'> {
  name: 'interactionCreate',
  once: false,
  execute: (...args: ClientEvents['interactionCreate']) => Promise<void>
}
