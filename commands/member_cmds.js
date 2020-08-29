const eventManip = require('../manipulations/eventManip');

/**
 * Handle the commands for members
 * @param {Message} msg 
 * @param {String} command 
 * @param {Array<String>} optionArr 
 * @returns If the command was handled
 */
function HandleMembersCommands(msg, command, optionArr){
  switch(command){
    case "guerr":
      var events = eventManip.GetActiveEvents(new Date(), "guerrilla"); // Get the events that are possible for today
      msg.author.send(eventManip.PrettyPrintEvent(events[0])); // Send a dm to the user
      msg.delete({timeout:1000});
      break;
    case "conq":
      var events = eventManip.GetActiveEvents(new Date(), "conquest"); // Get the events that are possible for today
      msg.author.send(eventManip.PrettyPrintEvent(events[0])); // Send a dm to the user
      msg.delete({timeout:1000});
      break;
    default:
      return false;
  }
  return true;
}

module.exports = {
    HandleMembersCommands
}