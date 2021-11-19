import { ClientEvents } from 'discord.js';

export interface IEventConfig<K extends keyof ClientEvents> {
  name: K,
  once: boolean,
  execute: (...args: ClientEvents[K]) => Promise<void>
}

export interface IReadyEventConfig extends IEventConfig<'ready'> {
  name: 'ready',
  once: true,
  execute: (...args: ClientEvents['ready']) => Promise<void>
}

export interface IInteractionCreateEventConfig extends IEventConfig<'interactionCreate'> {
  name: 'interactionCreate',
  once: false,
  execute: (...args: ClientEvents['interactionCreate']) => Promise<void>
}
