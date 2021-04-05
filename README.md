# Bot-Alice

Simple discord bot for SINoALICE guild

## Features

- Reminders (sending message to specific channels) with a cron job.
- Reminders for events sent to specific channel (can be turn off with "eventReminder")

## Setup

You need to create a folder called `usr_data` at root level. This folder will contain:

- config.json : The config for the bot. User defined.

### Config.json

Here's a example of the content inside a config.json :

```json
{
  "prefix": "!alice",
  "bot_token" : "TOKEN",
  "warningChannel" : "CHANNEL_ID",
  "wanings": [
    {
      "cronTime" : "CRON_TIME",
      "Message" : "@here Grid lock is coming in 15 minutes."
    },
    {
      "cronTime" : "CRON_TIME_2",
      "Message" : "@here Coliseum is starting in 15 minutes"
    }
  ],
  "eventConquestChannel": "CHANNEL_ID",
  "eventGuerillaChannel": "CHANNEL_ID",
  "eventReminder": true
}
```
> Cron time is time specified for cron. Example : You coliseum is at 22:00, then put "00 15 21 * * *" for a reminder at 21:15.

#### Bot token

Follow this [guide](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/) to create a token and know how to add the bot to your server.

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