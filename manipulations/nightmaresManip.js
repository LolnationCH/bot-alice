const fs = require('fs');
const path = require('path');

const nightmares_json_path = path.join(__dirname, '..', 'usr_data', 'nightmares.json');

/**
 * Reads the file containing the nightmares and return a js object
 * @returns {Array}
 */
function ReadNightmare(){
  if (fs.existsSync(nightmares_json_path)) {
    return JSON.parse(fs.readFileSync(nightmares_json_path).toString());
  }
  return [];
}

function WriteNightmare(dataStruct){
  let data = JSON.stringify(dataStruct, null, 2);
  fs.writeFileSync(nightmares_json_path, data);
}

function PrettyPrintUser(userArr){
  stre = "";
  userArr.forEach((x) => stre += (x + ", "));
  return stre.slice(0, -2);
}

/**
 * 
 * @param {Array<String>} OptionArr 
 */
function FetchUsers(OptionArr) {
  var ret = "\n";
  var data = ReadNightmare()
  for (var i = 0; i < OptionArr.length; i++ ){
    data.forEach( (x) => {
      if (x.users.length === 0)
        ret += "";
      else {
	var optionLowered = OptionArr[i].toLowerCase();
        if (x.colo_skill.toLowerCase().includes(optionLowered))
          ret += `${x.colo_skill} : ${PrettyPrintUser(x.users)}\n`;
        else {
          x.nightmares.forEach( (y) => {
            if (y.toLowerCase().includes(optionLowered))
              ret += `${x.colo_skill} : ${PrettyPrintUser(x.users)}\n`;
          })
        }
      }
    });
  }
  if (ret.replace("\n", "") === "")
    return "No user found";
  return ret;
}

function ParseAddReaction(reaction, user){
  if (reaction.message.channel.name !== "nightmares")
    return
  var data = ReadNightmare();
  var username = user.username;
  var nightmareCodeName = reaction._emoji.name;
  var index = data.findIndex((x) => x.emoji === nightmareCodeName);
  if (index !== -1){
    data[index].users.push(username);
  }
  WriteNightmare(data);
}

function ParseRemovedReaction(reaction, user){
  if (reaction.message.channel.name !== "nightmares")
    return

  var data = ReadNightmare();
  var username = user.username;
  var nightmareCodeName = reaction._emoji.name;
  var index = data.findIndex((x) => x.emoji === nightmareCodeName);
  if (index !== -1){
    data[index].users = data[index].users.filter( (x) => x !== username);
  }
  WriteNightmare(data);
}

function CreateNewEntry(line){
  var content = line.split(" ");
  var emoji = content[0].slice(2).split(":")[0];
  content = line.slice(content[0].length).trim();

  var n_con = content.split("(");
  var colo_skill = n_con[0].trim();
  content = content.slice(n_con[0].length);

  var nightmares = content.replace("(", "").replace(")", "").split(",");
  nightmares.forEach( (x, index) => {
    nightmares[index] = x.trim();
  })

  return {
    "nightmares": nightmares,
    "users": [],
    "colo_skill": colo_skill,
    "emoji": emoji
  }
}

async function AddReactions(data, reaction){
  for (var reactItem of reaction.message.reactions.cache){
    var react = reactItem[1];
    var inde = data.findIndex((x) => x.emoji === react._emoji.name);
    if (inde !== -1){
      var userCollection = await react.users.fetch()
      for (var user of userCollection){
        data[inde].users.push(user[1].username);
      }
    }
  }
  return data;
}

async function ParseAllReactionFromMessage(reaction){
  if (reaction.message.channel.name !== "nightmares")
    return
  
  var content = reaction.message.content.split("\n");
  var data = [];
  content.forEach((x) =>{
    data.push(CreateNewEntry(x, reaction))
  })

  data = await AddReactions(data, reaction);
  WriteNightmare(data);
}

module.exports = {
  FetchUsers,
  ParseAddReaction,
  ParseRemovedReaction,
  ParseAllReactionFromMessage
}
