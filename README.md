# discord-resource-bot
This bot will allow users to use /commands in discord to add resources to our knowledge base on airtable.


Currently to run this you will need to create a discord bot following [this](https://discordjs.guide/#before-you-begin) tutorial.

You will need to setup your .env vars as follows:

```
DISCORD_TOKEN=
GUILD_ID=
CLIENT_ID=
```

with that done you will be able to run `ts-node deploy-commands.ts` to create all of your commands.

After that you can start the bot by running `ts-node index.ts` to spin up the server. at this point you can look at the available commands by typing `/` in your chat bot.

Currently there's a `ping` command, and a `add-resource` command.

Please ping me in the discord should you have any questions! `@NoahH`
