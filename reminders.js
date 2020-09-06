const config = require('./usr_data/config.json');

var cron = require("cron");

var scheduledMessages = [];

function ConfigureAndStartWarningCronJobs(client){
  config.wanings.forEach((x) => {
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
}

module.exports = {
  ConfigureAndStartWarningCronJobs,
  StopWarningCronJobs
}