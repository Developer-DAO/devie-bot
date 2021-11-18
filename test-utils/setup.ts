import type * as TDiscord from 'discord.js'
import Discord, {SnowflakeUtil, User, CommandInteraction, GuildCacheMessage, InteractionReplyOptions} from 'discord.js'

export function createFakeClient() {
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

  const createRole = (role: string): TDiscord.Role => {
    // @ts-expect-error -- private constructor
    return new Discord.Role(
      client,
      {id: guild.id, name: role},
      guild,
    );
  };

  const createMember = async (username: string, role: TDiscord.Role, options = {}): Promise<TDiscord.GuildMember> => {
    // @ts-expect-error -- private constructor
    const newMember = new Discord.GuildMember(client, {nick: username}, guild)
    // @ts-expect-error -- private constructor
    newMember.user = new Discord.User(client, {
      id: SnowflakeUtil.generate(),
      username,
      discriminator: client.users.cache.size,
      ...options,
    });

    await newMember.roles.add(role)

    return newMember
  };

  const createChannel = (name: string, type = 'category') => {
    return guild.channels.create(name, {
      type
    });
  };

  const createCommandInteraction = (channel: TDiscord.Channel, member: TDiscord.GuildMember) =>
    (command: string, options = {}): TDiscord.CommandInteraction => {
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
      member: member,
      user: member.user,
      data: {
        id: SnowflakeUtil.generate(),
        name: 'add-tag',
        options: [],
        resolved: {},
        guild_id: guild.id,
      },
    });
  };

  return {
    client,
    guild,
    createRole,
    createMember,
    createChannel,
    createCommandInteraction,
  };
}

export async function setup() {
  const { client, guild, createRole, createMember, createChannel, createCommandInteraction } = createFakeClient();
  const devRole = createRole('dev');
  guild.roles.cache.set(guild.id, devRole);
  client.guilds.cache.set(guild.id, guild);

  const member = await createMember('fakeUser', devRole);
  guild.members.cache.set(member.id, member);
  client.users.cache.set(member.id, member.user);

  const channel = createChannel('intro');
  guild.channels.cache.set(channel.id, channel);

  return {
    createCommandInteraction: createCommandInteraction(channel, member)
  };
}
