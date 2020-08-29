# Bot-Alice

Simple discord bot for sinoalice guild

## Features

- Direct message for time remaining before next conquest and guerilla mission.
- Keeping track of the nightmare list of the guild members with a post and reaction
- Seeing who has which nightmare.
- Set and show which demon will be call during coliseum.

## Commands

The bot prefix must be set in the config.json file. See details below.

List of commands available to every member:

- guerr : Dm the user with the time remaining before the next guerilla event.
- conq : Dm the user with the time remaining before the next conquest event.
  - Conquest may not occur if no conquest is currently available to the users

List of commands available to every gm (they also have access to the commands defined above):
- whohas : Show the user who has the nightmare queryed.
- setdem : Set the demons of the coliseum
- usetdem : Un-set the demons of the coliseum (you can simply re-called the `setdem` command to replace demons)
- getdem : Show the pictures for the demon (uses pictures of A-S)

## Setup

You need to create a folder called `usr_data` at root level. This folder will contain:

- config.json : The config for the bot. User defined.

### Config.json

Here's a example of the content inside a config.json :

```json
{
  "prefix": "!alice",
  "bot_token" : "token",
  "nightmare_url": "https://spreadsheets.google.com/feeds/cells/SPREADSHEETID/1/public/full?alt=json",
  "roles" : {
    "gms" : ["ROLE_ID_1", "ROLE_ID_2", "ROLE_ID_3"],
    "members" : ["ROLE_ID_4"]
  }
}
```
#### Bot token

Follow this [guide](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/) to create a token and know how to add the bot to your server.

#### Nightmare Url
To setup the spreadsheet url, follow this [guide](https://coderwall.com/p/duapqq/use-a-google-spreadsheet-as-your-json-backend).

The spreadsheet must follow this structure :

Timestamp | Username | List of nightmares
--|--|--
8/28/2020 19:47:12 | Username | SR Karkinos, Sr Cecillia

#### Roles

You can use one or more discord roles to handle permission for gms and members. 

Simply use their id and paste them in their respective category in the config.json.

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

```bash
# Returns the pid
ps aux | grep "node index.js" | awk '{print $2}'
# kills the process
kill -9 PID_RECEIVED_IN_PREVIOUS_LINE
```