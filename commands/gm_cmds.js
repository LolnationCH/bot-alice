const nightmaresManip = require('../manipulations/nightmaresManip');
const nightmareInfoManip = require('../manipulations/nightmareInfoManip');
const shinmaManip = require('../manipulations/shinmaManip');

/**
 * Set the demons for the coliseum
 * @param {Message} msg 
 * @param {Array<String>} optionArr 
 */
function HandleSetDemon(msg, optionArr){
  if (optionArr.length !== 2)
    msg.reply("You need to specify two demon");
  else {
    var ret = shinmaManip.SetShinmaForColiseum(optionArr[0], optionArr[1]);
    if (ret !== undefined)
      msg.reply(ret);
  }
  msg.delete({timeout:1000}); 
}

/**
 * Takes an array of mesage and option object to send to an channel.
 * Send the message synchronous
 * @param {Message} msg 
 * @param {Array<Array<String, Any>>} MessageAndFiles 
 */
async function SendMultipleMessageAndFiles(msg, MessageAndFiles){
  for (var i = 0; i < MessageAndFiles.length; i++)
    await msg.channel.send(MessageAndFiles[i][0], MessageAndFiles[i][1]);
}

/**
 * Handle the commands for gms
 * @param {Message} msg 
 * @param {String} command 
 * @param {Array<String>} optionArr 
 * @returns If the command was handled
 */
function HandleGmCommands(msg, command, optionArr){
  switch(command){
    case "whohas":
      nightmaresManip.FetchUsers(optionArr, msg); 
      break;
    case "setdem":
      HandleSetDemon(msg, optionArr);
      break;
    case "usetdem":
      shinmaManip.UnsetShinma();
      msg.delete({timeout:1000});
      break;
    case "getdem":
      SendMultipleMessageAndFiles(msg, shinmaManip.GetShinmaInfo());
      msg.delete({timeout:1000});
      break;
    case "list":
      nightmaresManip.FetchUserNightmares(msg, optionArr[0]);
      break;
    case "night":
      nightmareInfoManip.GetNightmareInfo(msg, optionArr, nightmareInfoManip.FilterByNightmareNames);
      break;
    case "skill":
      nightmareInfoManip.GetNightmareInfo(msg, optionArr, nightmareInfoManip.FilterByNightmareSkillName);
      break;
    default:
      return false;
  }
  return true;
}

module.exports = {
  HandleGmCommands
}