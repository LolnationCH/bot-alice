var helpMsgs = require('./game_data/helpMsg.json');


function GetHelpMessage(id){
  var message = "";
  helpMsgs.forEach((x) => {
    if (x.id === id)
      message = x.message;
  });
  return message;
}

module.exports = {
  GetHelpMessage
}