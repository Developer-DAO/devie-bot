import type * as TDiscord from 'discord.js'
type DiscordManagerType = {
  channels: Record<
    string,
    {guild_id: string; id: string; type: number; deleted?: boolean}
  >
  guilds: Record<string, TDiscord.Guild>
  clients: Array<TDiscord.Client>
  reactions: Record<string, Record<string, TDiscord.MessageReaction>>
  interaction: Record<string, { type: TDiscord.InteractionType } & TDiscord.InteractionReplyOptions>,
  cleanup: () => void
}

/**
 * this is used by the API to get channel and guild by their ids.
 * This is useful to clean up all things after each test and
 * to enable API to access guilds and channels because we don't have a DB
 **/
const InternalDiscordManager: DiscordManagerType = {
  channels: {},
  guilds: {},
  clients: [],
  // map of message IDs to a map of reaction emoji names to the MessageReaction
  reactions: {},
  interaction: {},
  cleanup: () => {
    InternalDiscordManager.channels = {}
    InternalDiscordManager.guilds = {}
    InternalDiscordManager.reactions = {}
    InternalDiscordManager.clients.forEach(client => client.destroy())
  },
}

export { InternalDiscordManager }
