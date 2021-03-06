const config = require('./usr_data/config.json');

const conquest = require('./game_data/conquest.json');
const guerilla = require('./game_data/guerrilla.json');

var cron = require("cron");

var scheduledMessages = [];
var eventScheduledMessages = []

function ConfigureAndStartWarningCronJobs(client){
  config.warnings.forEach((x) => {
    let scheduledMessage = new cron.CronJob(x.cronTime, () => {
      var announcements = client.channels.cache.get(config.warningChannel);
      announcements.send(x.Message);
    });
    scheduledMessages.push(scheduledMessage);
  });

  scheduledMessages.forEach((x) => x.start());
}

function StopWarningCronJobs(){
  scheduledMessages.forEach((x) => x.stop());
  eventScheduledMessages.forEach((x) => x.stop());
}

function TimeHourToCronTime(strHhmm, minutesMinus=3){
  var [hours, minutes] = strHhmm.split(':');
  if (minutes-minutesMinus < 0){
    hours -= 1;
    minutes = 60;
  }
  return `00 ${minutes-minutesMinus} ${hours} * * *`;
}

/**
 * Set the reminders for the guerrilla and conquest events
 * @param {Discord.Client} client
 */
function ConfigureEventReminders(client){
  conquest.forEach((x) => {
    let scheduledMessage = new cron.CronJob(TimeHourToCronTime(x.start_time), () => {
      var eventConquestChannel = client.channels.cache.get(config.eventConquestChannel);
      eventConquestChannel.send(`3 minutes before ${x.name}`);
    });
    eventScheduledMessages.push(scheduledMessage);
  });

  guerilla.forEach((x) => {
    let scheduledMessage = new cron.CronJob(TimeHourToCronTime(x.start_time), () => {
      var eventGuerillaChannel = client.channels.cache.get(config.eventGuerillaChannel);
      eventGuerillaChannel.send(`3 minutes before ${x.name}`);
    });
    eventScheduledMessages.push(scheduledMessage);
  });

  eventScheduledMessages.forEach((x) => x.start());
  
}

module.exports = {
  ConfigureAndStartWarningCronJobs,
  ConfigureEventReminders,
  StopWarningCronJobs,
}