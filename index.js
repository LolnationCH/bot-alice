const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// Bot code
const reminders = require('./reminders');

// Bot config
const config = require('./usr_data/config.json');

/**
 * Calculate the prefix, command and option the user pass to the bot.
 * @param {Array<String>} messages 
 * @returns an array containing the prefix, command and option. [String, String, Array<String>]
 */
function GetMessagesParameters(messages){
  return [messages[0], messages[1], messages.slice(2)];
}

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  reminders.ConfigureAndStartWarningCronJobs(client);
  if (config.eventReminder)
    reminders.ConfigureEventReminders(client);
});

// Handles the users commands
client.on('message', msg => {
  if (msg.member === null || msg.member.roles === undefined)
    return; // If msg author has no roles, simply return.
  
  // Get message contents
  var messages = msg.content.split(" ");
  const [prefix, command, optionArr] = GetMessagesParameters(messages);

  if (prefix === config.prefix) {

  }
  else {
    msg.delete({timeout:1000});
  }
});

client.login(config.bot_token);