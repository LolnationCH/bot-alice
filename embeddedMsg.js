const Discord = require('discord.js');

function GetMessageToSend(fields, classImageUrl, updateId){
  // inside a command, event listener, etc.
  return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Info for next update')
    .setURL('https://sinoalice.global/en/developer_notes/' + updateId)
    .setAuthor('LolnationCH', 'https://cdn.discordapp.com/avatars/236850830311948292/a_fe5290f39c1bfed5caab12145ac03c9e.png?size=256')
    .setDescription("What's coming in the next update")
    .addFields(fields)
    .setImage(classImageUrl);
}


module.exports = {
  GetMessageToSend
}