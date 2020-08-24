const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const eventManip = require('./manipulations/eventManip');
const nightmaresManip = require('./manipulations/nightmaresManip');
const helpMsgs = require('./helpMsg');

const gmUsernames = require('./usr_data/guild_masters.json');
const config = require('./usr_data/config.json');

const AccessLevel = {
  "GM" : "0",
  "PARTIAL" : "1",
  "NONE" : "-1"
}

/**
 * 
 * @param {string} authorUsername 
 * @returns access level
 */
function CalculateAccessLevel(authorUsername){
  if (gmUsernames.includes(authorUsername))
    return AccessLevel["GM"];
  else
    return AccessLevel["PARTIAL"];
}

async function UpdateReaction(reaction,) {
  if (reaction.partial && reaction.message.id === config.messageId) {
		try {
      await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
    }
  }
  if (reaction.message.id === config.messageId){
    await nightmaresManip.ParseAllReactionFromMessage(reaction);
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageReactionAdd', async (reaction) => {
	UpdateReaction(reaction);
});

client.on('messageReactionRemove', async (reaction, user) => {
	UpdateReaction(reaction);
});


client.on('message', msg => {
  var messages = msg.content.split(" ");
  var access_level = CalculateAccessLevel(msg.author.username.toLowerCase());

  if (access_level !== AccessLevel["NONE"] && 
      messages[0] === config.prefix)
  {
    if (messages[1] === "guerr") {
      var events = eventManip.GetActiveEvents(new Date(), "guerrilla"); // Get the events that are possible for today
      msg.author.send(eventManip.PrettyPrintEvent(events[0])); // Send a dm to the user
    }
    else if (messages[1] === "conq"){
      var events = eventManip.GetActiveEvents(new Date(), "conquest"); // Get the events that are possible for today
      msg.author.send(eventManip.PrettyPrintEvent(events[0])); // Send a dm to the user
    }
    else if (access_level === AccessLevel["GM"] &&
             messages[1] === "whohas"){
      var ret = nightmaresManip.FetchUsers(messages.slice(2));
      if (ret !== undefined)
        msg.reply(ret);
    }
    else
      msg.reply(helpMsgs.GetHelpMessage("mainHelpMessage"));

    // Remove the user message
    msg.delete({timeout:1000}); 
  }
});

client.login(config.bot_token);