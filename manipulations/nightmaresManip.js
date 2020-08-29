const fs = require('fs');
const path = require('path');
const request = require('request');

const config = require('../usr_data/config.json');

function ParseSheet(entry){
  var objects = [];
  for (var i = 4; i < entry.length; i = i + 3){
    objects.push({"username": entry[i]["content"]["$t"], "nightmares": entry[i+1]["content"]["$t"].split(',').map((x) => x.trim())});
  }
  return objects;
}

function GetUsersWithNightmares(NightmaresArr, userObjects){
  var users_arr = [];
  var nightmares_name = [];
  for (var i = 0; i < NightmaresArr.length; i++ ) {
    var optionLowered = NightmaresArr[i].toLowerCase();
    var users = []
    userObjects.forEach((x) => {
      x.nightmares.forEach( (y) => {
        if (y.toLowerCase().includes(optionLowered)){
          users.push(x.username);
          nightmares_name[i] = y;
        }
      })
    });
    users_arr[i] = users;
  }
  return [users_arr, nightmares_name]
}

function FetchUsers(OptionArr, msg){
  request(config.nightmare_url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    const entry = body.feed.entry;
    var userObjects = ParseSheet(entry);

    var [users_arr, nightmares_name] = GetUsersWithNightmares(OptionArr, userObjects);
    var ret = "";
    nightmares_name.forEach((x, i) => {
      ret += `${x} : ${users_arr.join(',')}\n`
    });

    msg.reply(ret);
    msg.delete({timeout:1000}); 
  });
}

function FetchUserNightmares(msg, Username){
  if (Username === undefined) {
    msg.reply("You must specify an Username");
    msg.delete({timeout:1000}); 
    return;
  }

  request(config.nightmare_url, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    const entry = body.feed.entry;
    var userObjects = ParseSheet(entry);

    var ret = "No user found";
    var userInfo = userObjects.filter((x) => x.username.toLowerCase().includes(Username.toLowerCase()))[0];
    
    if (userInfo !== undefined){
      var ret = `${userInfo.username} : `;
      userInfo.nightmares.forEach((x, i) => {
        ret += `\n${x}, `
      });
      ret = ret.slice(0, ret.length - 2);
    }

    msg.reply(ret);
    msg.delete({timeout:1000}); 
  });
}

module.exports = {
  FetchUsers,
  FetchUserNightmares
}
