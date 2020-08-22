# Bot-Alice

Simple discord bot for sinoalice guild

## Features

- Direct message for time remaining before next conquest and guerilla mission.
- Keeping track of the nightmare list of the guild members with a post and reaction
- Getting the order of summon during coliseum
- Seeing who has which nightmare/coliseum skill

## Commands

The bot prefix must be set in the config.json file. See details below.

List of commands :

- guerr : Dm the user with the time remaining before the next guerilla event.
- conq : Dm the user with the time remaining before the next conquest event.
  - Conquest may not occur if no conquest is currently available to the users
- order : Show the order of summon for the coliseum.
- whohas : Show the user who has the nightmare or the coliseum skill associated.

## Setup

You need to create a folder called `usr_data` at root level. This folder will have theses files:

- guild_masters.json : Contains a list of people with full bot commands. User defined.
- config.json : The config for the bot. User defined.
- order.json : The order of the summon. User defined.
- nightmares.json : Manipulate with the bot, do not manually edit this file, it will be overwritten by the bot.

Only guild_masters.jons, order.json and config.json has to be created by a user.

### File Contents

Here's a example of the content inside a guild_masters.json :

```json
["username1", "username2", "username3", "username4"]
```

Simply replace username by the discord username of the person.

Here's a example of the content inside a config.json :

```json
{
  "prefix": "!alice",
  "messageId" : "message_id",
  "bot_token" : "token"
}
```

You can get the message_id to parse for the nightmare by right clicking your post and selecting "copy id".

Follow this [guide](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/) to create a token and know how to add the bot to your server.

Here's a example of the content inside a order.json :

```json
{
  "order": [
    {
      "name": "Wisp",
      "user": "Username1",
      "order": 1
    },
    {
      "name": "Fina",
      "user": "Username2",
      "order": 2
    }
  ],
  "demon": [
    {
      "name": "Eris",
      "user": "Username3",
      "order": "Demon"
    }
  ],
  "counter": [
    {
      "name": "Shadowlord",
      "user": "Username4",
      "order": "Counter"
    }
  ]
}
```

Then once the file are created, you are good to go!

### Running the bot

I recommend running it on a raspberry pi (or something always on) which has npm.

If you don't have nodejs, install it on your pc.

Then run in a prompt (cmd) this command :

```bash
npm install
```

This will install all the node modules you need to have to be able to run the bot.

To run the bot, you can use `run.sh` or simply type in a cmd :

```cmd
node index.js > stdout.txt 2> stderr.txt &
```

Simply kill the node process if you want to kill the bot (or shutdown your pc :) )
