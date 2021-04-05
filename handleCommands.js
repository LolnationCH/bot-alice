const embeddedMessages = require("./usr_data/embeddedMessages")
const embeddedMsg = require('./embeddedMsg');

function HandleCommands(msg, command, optionsArr) {
  switch (command){
    case "printMessage":{
      const em = embeddedMsg.GetMessageToSend(embeddedMessages.MessageFields, embeddedMessages.ClassImage, embeddedMessages.UpdateId);
      msg.channel.send(em);
      break;
    }
  }
}

module.exports = {
  HandleCommands
}