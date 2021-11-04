# discord-resource-bot

This bot will allow users to use /commands in discord to add resources to our knowledge base on airtable.

Currently to run this you will need to create a discord bot following [this](https://discordjs.guide/#before-you-begin) tutorial.

You will need to setup your .env vars as follows:

```
DISCORD_TOKEN=
GUILD_ID=
CLIENT_ID=
```

Once you have created your bot and added the environment variables above, you can create all its commands by running:

```
npm run deploy:commands
```

After that you can start the bot server by running:

```
npm run server
```

At this point you can look at the available commands by typing `/` in your chat bot.

Currently there's a `ping` command, and a `add-resource` command.

Please ping `@NoahH` in the discord should you have any questions!

## Linting

To check your code will compile and is linted appropriately, you can run:

```
npm run lint
```
