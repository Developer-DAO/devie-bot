import type * as TDiscord from 'discord.js';
import Discord, { SnowflakeUtil, CommandInteraction } from 'discord.js';
import { InternalDiscordManager } from './InternalDiscordManager';

function createFakeClient() {
  const client = new Discord.Client({ intents: [] });
  Object.assign(client, {
    token: process.env.DISCORD_TOKEN,
    // @ts-expect-error -- private constructor
    user: new Discord.ClientUser(client, {
      id: SnowflakeUtil.generate(),
      bot: true,
      username: 'BOT',
    }),
  });

  // @ts-expect-error -- private constructor
  const guild = new Discord.Guild(client, {
    id: SnowflakeUtil.generate(),
    name: 'Developer_DAO',
  });

  client.guilds.cache.set(guild.id, guild);
  InternalDiscordManager.guilds[guild.id] = guild

  const createRole = (name: string): TDiscord.Role => {
    // @ts-expect-error -- private constructor
    const role = new Discord.Role(
      client,
      { id: guild.id, name },
      guild,
    );

    guild.roles.cache.set(guild.id, role);

    return role;
  };

  const createMember = async (username: string, role: TDiscord.Role, options = {}): Promise<TDiscord.GuildMember> => {
    // @ts-expect-error -- private constructor
    const newMember = new Discord.GuildMember(client, { nick: username }, guild)
    // @ts-expect-error -- private constructor
    newMember.user = new Discord.User(client, {
      id: SnowflakeUtil.generate(),
      username,
      discriminator: client.users.cache.size,
      ...options,
    });

    guild.members.cache.set(newMember.id, newMember);
    client.users.cache.set(newMember.id, newMember.user);

    await newMember.roles.add([role]);
    return newMember
  };

  const createChannel = async (name: string, type = 'category') => {
    const channel = await guild.channels.create(name, {
      type,
    });

    guild.channels.cache.set(channel.id, channel);

    return channel;
  };

  const createCommandInteraction = (channel: TDiscord.Channel, member: TDiscord.GuildMember, devRole: TDiscord.Role) =>
    (command: string, options: unknown[] = []): TDiscord.CommandInteraction => {
      // @ts-expect-error -- private constructor
      return new CommandInteraction(client, {
        id: SnowflakeUtil.generate(),
        application_id: '',
        guild: guild,
        guild_id: guild.id,
        type: 2,
        token: '',
        version: 1,
        channel_id: channel.id,
        // When using `member` directly, the creation was not working
        // for some reason. Changing to this hardcoded object worked.
        member: {
          permissions: '',
          deaf: false,
          mute: false,
          joined_at: '0',
          roles: [devRole.id],
          user: {
            id: member.user.id,
            discriminator: member.user.discriminator,
            username: member.user.username,
            avatar: member.user.avatar,
          },
        },
        user: member.user,
        data: {
          id: SnowflakeUtil.generate(),
          name: command,
          options,
          resolved: {},
          guild_id: guild.id,
        },
      });
    };

  function cleanup() {
    InternalDiscordManager.cleanup()
  }

  InternalDiscordManager.clients.push(client)

  return {
    client,
    guild,
    createRole,
    createMember,
    createChannel,
    createCommandInteraction,
    cleanup,
  };
}

async function setup() {
  const {
    createRole,
    createMember,
    createChannel,
    createCommandInteraction,
    cleanup,
  } = createFakeClient();

  const devRole = createRole('dev');
  const member = await createMember('fakeUser', devRole);
  const channel = await createChannel('intro');

  return {
    createCommandInteraction: createCommandInteraction(channel, member, devRole),
    cleanup,
  };
}

export { InternalDiscordManager, setup };
