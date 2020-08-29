const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// Bot code
const helpMsgs = require('./helpMsg');
const GmCmds = require('./commands/gm_cmds');
const MemberCmds = require('./commands/member_cmds');

// Bot data
const config = require('./usr_data/config.json');
const AccessLevel = {
  "GM" : "0",
  "MEMBER" : "1",
  "NONE" : "-1"
}

/**
 * Returns the AccessLevel of the user. To be use with comparaison to the object.
 * @param {Collection<String>} memberRoles
 * @returns access level
 */
function CalculateAccessLevel(memberRoles){
  var IsGm = false;
  config.roles.gms.forEach((x) => {
    if (memberRoles.cache.has(x))
      IsGm = true;
  })
  if (IsGm)
    return AccessLevel["GM"];

  var IsMember = false;
  config.roles.members.forEach((x) => {
    if (memberRoles.cache.has(x))
      IsMember = true;
  })
  if (IsMember)
    return AccessLevel["MEMBER"];

  return AccessLevel["NONE"];
  
}

/**
 * Calculate the prefix, command and option the user pass to the bot.
 * @param {Array<String>} messages 
 * @returns an array containing the prefix, command and option. [String, String, Array<String>]
 */
function GetMessagesParameters(messages){
  return [messages[0], messages[1], messages.slice(2)];
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Handles the users commands
client.on('message', msg => {
  if (msg.member === null || msg.member.roles === undefined)
    return; // If msg author has no roles, simply return.
  
  // Get message contents
  var messages = msg.content.split(" ");
  const [prefix, command, optionArr] = GetMessagesParameters(messages);

  // Get message access level
  const access_level = CalculateAccessLevel(msg.member.roles);

  // Check if user has access to the bot
  if (access_level !== AccessLevel["NONE"] &&
      prefix === config.prefix)
  {
    // Execute the command the user wants if he has the right to.
    var hasHandledCommand = false;
    if (access_level === AccessLevel["GM"]) {
      hasHandledCommand = GmCmds.HandleGmCommands(msg, command, optionArr);
    }
    if (!hasHandledCommand) {
      hasHandledCommand = MemberCmds.HandleMembersCommands(msg, command, optionArr);
    }

    // Send help message if the message wasn't handled.
    if (!hasHandledCommand) {
      msg.reply(helpMsgs.GetHelpMessage("mainHelpMessage"));
      msg.delete({timeout:1000});
    }
  }
});

client.login(config.bot_token);