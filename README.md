# discord-resource-bot

## TL;DR

This bot will allow members of the DAO to use `/slash` commands in Discord to interact with our Airtable knowledgebase.

## Development Setup

1. Fork the [`discord-resource-bot` repository](https://github.com/Developer-DAO/discord-resource-bot) into your GitHub account

2. Clone the fork to your local system

```bash
git clone git@github.com:YOUR_USER_NAME/discord-resource-bot.git
```

3. Install Node modules

```bash
npm install
```

4. Create a `.env` file at the root of the project

```bash
touch .env
```

5. Follow [this tutorial](https://discordjs.guide/preparations/setting-up-a-bot-application.html) to create a Discord bot. Then, update your `.env` with the `DISCORD_TOKEN` and `CLIENT_ID` values created during the tutorial.

```bash
# .env

DISCORD_TOKEN=abc
CLIENT_ID=123
```

6. We also need to add our `GUILD_ID` to the `.env` file. This can be found in your Discord server settings under Widget > Server ID.

```bash
# .env

GUILD_ID=xyz
```

7. Deploy your commands to the bot created above

```bash
npm run deploy:commands
```

8. Start the bot server

```bash
npm run dev
```

Now, you can test out the slash commands you've created in the Discord server where you installed the bot.

## Commands

These are the current commands the bot supports:

- `/add-author` - Add an author to the knowledge base
- `/add-blockchain` - Add a blockchain to the knowledge base
- `/add-category` - Add a category to the knowledge base
- `/add-contributor` - Add a category to the knowledge base
- `/add-resource` - Add a new resource to the knowledge base
- `/add-tag` - Add a tag to the knowledge base
- `/ping` - Send a test request to the bot

## Linting

To check if your code will compile and is linted appropriately, you can run:

```
npm run lint
```

## Production deployment

The bot is deployed to [Heroku](https://heroku.com)

See [Heroku](docs/heroku.md) for more information.

## Support

Please ping `@NoahH` in the discord should you have any questions!
