var guerrilla = require('../game_data/guerrilla-utc.json');
var conquest = require('../game_data/conquest-utc.json');

/**
 * Compare the current date with the time pass in argument.
 * timeStr must respect the standard HH:MM, and hours can be higher then 24
 * 
 * @param {Date} curDate 
 * @param {String} timeStr 
 * @returns {Boolean}
 */
function IsTimeBigger(curDate, timeStr){
  var time = timeStr.split(':');
  var date = new Date(curDate);
  
  date.setUTCHours(time[0]);
  date.setUTCMinutes(time[1]);

  return date <= curDate;
}

/**
 * Get the milliseconds between the timeStr and the current date.
 * timeStr must respect the standard HH:MM, and hours can be higher then 24
 * 
 * @param {Date} curDate 
 * @param {String} timeStr 
 * @returns {Number}
 */
function GetTimeRemaining(curDate, timeStr){
  var time = timeStr.split(':');
  var date = new Date(curDate);
  
  date.setUTCHours(time[0]);
  date.setUTCMinutes(time[1]);
  return date - curDate;
}

/**
 * Get the event array based on the name of it.
 * 
 * @param {String} eventName 
 * @returns {Array<Object>}
 */
function GetEventsArray(eventName){
  switch(eventName){
    case "guerrilla":
      return guerrilla;
    case "conquest":
    default:
      return conquest;
  }
}

/**
 * Get all the active events for the day for the specify event type.
 * 
 * @param {Date} curDate 
 * @param {String} eventName 
 * @returns {Array<Object>}
 */
function GetActiveEvents(curDate, eventName){
  var eventsArray = GetEventsArray(eventName)
  var eventFiltered = [];
  for (var i = 0; i < eventsArray.length; i++)
  {
    var obj = eventsArray[i];
    if (IsTimeBigger(curDate, obj.end_time))
      continue;

    obj["time_remaining"] = GetTimeRemaining(curDate, obj.start_time);    
    eventFiltered.push(obj);
  }
  return eventFiltered;
}

/**
 * Returns a string to print from a event.
 * 
 * @param {Object} jsonObj 
 * @returns {String}
 */
function PrettyPrintEvent(jsonObj){
  var tim_rem = "";
  if (jsonObj.time_remaining > 0){
    var time_remaining = new Date(jsonObj.time_remaining);
    var hour = time_remaining.getUTCHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    var min  = time_remaining.getUTCMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    tim_rem = `Starts in ${hour}:${min}`;
  }
  else
    tim_rem = "Active";
  
  return `${jsonObj.name} : ${tim_rem}`;
}

module.exports = {
  GetActiveEvents,
  PrettyPrintEvent
}