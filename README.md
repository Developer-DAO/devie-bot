# DEVIE Bot 🤖
>it's probably nothing

## TL;DR

Devie is a discord bot by the devs for the devs. Currently acts as an aggregator of content for the #newsletter team. Also, this bot will allow members of the DAO to use `/slash` commands in Discord to interact with our Airtable knowledgebase. Will be expanded on greatly in the future.  ✨

## How it Works

1. Upvote posts in either `#🔮-probably-nothing` or `#learning-resources` by reacting with a 📰 (:newspaper:)
2. Five 📰 will trigger the bot to post into the `#newsletter` channel (might be updated)
3. The team will use these votes to further curate the newsletter 🤙

## Development Setup

1. Fork the [`devie-bot` repository](https://github.com/Developer-DAO/devie-bot) into your GitHub account

2. Clone the fork to your local system

```bash
git clone git@github.com:YOUR_USER_NAME/devie-bot.git
```

3. Install Node modules

```bash
npm install
```

4. Create a `.env` file at the root of the project

```bash
touch .env
```

5. Follow [this tutorial](https://discordjs.guide/preparations/setting-up-a-bot-application.html) to create a Discord bot. Then, update your `.env` with the `DISCORD_TOKEN`, `CLIENT_ID` values created during the tutorial.

```bash
# .env

DISCORD_TOKEN=abc
CLIENT_ID=123
```

6. We also need to add our `GUILD_ID` to the `.env` file. We also need `POST_TO`, `CURATE_FROM` and `POST_THRESHOLD` for the curation portion. In discord, with developer mode enabled, right clicking any avatar or channel name will present a `Copy ID` option.

```bash
# .env

GUILD_ID=xyz
POST_TO=id
CURATE_FROM=id,id,id
POST_THRESHOLD=5
```

7. Start the bot server

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
- `/add-glossary` - Add a glossary term and description to the knowledge base

## Linting

To check if your code will compile and is linted appropriately, you can run:

```
npm run lint
```

## Production deployment

The bot is deployed to [Heroku](https://heroku.com)

See [Heroku](docs/heroku.md) for more information.

## Support

Please reach out in the bot channel for support: `DAO PROJECTS > discord-bot`
