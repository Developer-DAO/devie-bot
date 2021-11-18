import type * as TDiscord from 'discord.js'
import { rest } from 'msw'
import { SnowflakeUtil, Util } from 'discord.js'
import { InternalDiscordManager } from '../setup'

/**
 * Handlers to mock the calls to the discord API,
 * which are used to set up the client for testing.
 */
const handlers = [
  rest.post('*/api/:apiVersion/guilds/:guild/channels', (req, res, ctx) => {
    const createdChannel = {
      id: SnowflakeUtil.generate(),
      guild_id: req.params.guild,
      ...(req.body as {type: number}),
    }

    InternalDiscordManager.channels[createdChannel.id] = {
      ...createdChannel,
    }

    return res(ctx.status(200), ctx.json(createdChannel))
  }),
  rest.put(
    '*/api/:apiVersion/guilds/:guildId/members/:memberId/roles/:roleId',
    (req, res, ctx) => {
      const { guildId, memberId, roleId } = req.params
      requiredParam(guildId, 'guildId param required')
      requiredParam(memberId, 'memberId param required')
      requiredParam(roleId, 'roleId param required')

      const guild = InternalDiscordManager.guilds[guildId];
      if (!guild) {
        throw new Error(`No guild with the ID of ${guildId}`)
      }

      const user = Array.from(guild.members.cache.values()).find(
        guildMember => guildMember.user.id === memberId,
      ) as TDiscord.GuildMember & {_roles: Array<string>}

      const assignedRole = guild.roles.cache.get(roleId)
      if (!assignedRole) {
        throw new Error(`No role with the ID of ${roleId}`)
      }
      user._roles.push(assignedRole.id)
      return res(ctx.status(200), ctx.json({ id: memberId }))
    },
  ),
  rest.patch(
    '*/api/:apiVersion/guilds/:guildId/members/:memberId',
    (req, res, ctx) => {
      const { guildId, memberId } = req.params
      const { roles } = req.body as { roles: string[] };
      requiredParam(guildId, 'guildId param required')
      requiredParam(memberId, 'memberId param required')

      const guild = InternalDiscordManager.guilds[guildId];
      if (!guild) {
        throw new Error(`No guild with the ID of ${guildId}`)
      }

      const user = Array.from(guild.members.cache.values()).find(
        guildMember => guildMember.user.id === memberId,
      ) as TDiscord.GuildMember & {_roles: Array<string>}
      user._roles = roles;

      return res(ctx.status(200), ctx.json({ id: memberId }))
    },
  ),
]

function requiredParam(
  value: unknown,
  message: string,
): asserts value is string {
  if (typeof value !== 'string') throw new Error(message)
}

export { handlers }
