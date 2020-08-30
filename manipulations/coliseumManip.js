const got = require('got');

const shinma_infos = require('../game_data/shinma_info.json');
const strategy_url = require('../usr_data/config.json').strategy_url;

var shinmaInfo1 = undefined;
var shinmaInfo2 = undefined;

var coliseumStrategy = undefined;

/**
 * Set the shinma for the coliseum. Only needs the prefix, of the shinma
 * @param {String} shinmaName1 Name of the first shinma (prefix only)
 * @param {String} shinmaName2 Name of the second shinma (prefix only)
 */
function SetShinmaForColiseum(shinmaName1, shinmaName2){
  shinma_infos.forEach( (x) => {
      if (x.name.toLowerCase().includes(shinmaName1.toLowerCase()))
          shinmaInfo1 = x;
      else if (x.name.toLowerCase().includes(shinmaName2.toLowerCase()))
          shinmaInfo2 = x
  })
}

/**
 * Make the stored shinma undefined
 */
function UnsetShinma(){
  shinmaInfo1 = undefined;
  shinmaInfo2 = undefined;
}

/**
 * Returns a Array containing the stuff the bot must send to the user
 * @param {String} prefix Message (either 'First Demon' or 'Second Demon')
 * @param {*} shinmaInfo object containing the info
 * @returns a Array containing the stuff the bot must send to the user
 */
function _GetShinmaInfo(prefix, shinmaInfo){
  if (shinmaInfo === undefined)
    return [`${prefix} is undefined`]
  if (shinmaInfo.url_img !== "")
    return [prefix, {files:[shinmaInfo.url_img]}]
  else 
    return [`${prefix}\nName : ${shinmaInfo.name}\nCall conditions : ${shinmaInfo.call_conditions.join(",")}`, {}]
}

/**
 * Get the shinmas information
 */
function GetShinmaInfo(){
  return [
    _GetShinmaInfo("First Demon", shinmaInfo1),
    _GetShinmaInfo("Second Demon", shinmaInfo2),
  ]
}

function ParseSheet(entry){
  const strategyNameHeader = "Strategy Name : ";

  var strategies = [];

  for (var i = 0; i< entry.length; i++){
    var content = entry[i]["content"]["$t"];
    
    if (content === strategyNameHeader){
      var strategy = {};
      strategy.name = entry[i+1]["content"]["$t"];
      strategy.steps = [];

      for (var j = i+2; entry[j] !== undefined && entry[j]["content"]["$t"] !== strategyNameHeader; j=j+3){
        strategy.steps.push({
          nightmare: entry[j]["content"]["$t"],
          time: entry[j+1]["content"]["$t"],
          user: entry[j+2]["content"]["$t"]
        });
        
      }
      strategies.push(strategy);
    }
  }
  return strategies;
}

async function FetchColiseumStartegy() {
  try {
    const response = await got(strategy_url);
    const body = await JSON.parse(response.body);
    const entry = body.feed.entry;
    return ParseSheet(entry);
  } catch (error) {
      console.log(error);
  }
}

function SetColiseumStrategy(msg, strategyName){
  (async () => {
    var strategies = await FetchColiseumStartegy();
    const strategy = strategies.filter( (x) => x.name.toLowerCase() === strategyName.toLowerCase())[0];
    
    if (strategy === undefined)
        msg.reply("Strategy not found.");
    coliseumStrategy = strategy;
    msg.delete({timeout:1000});
  })();
}

function PrettyPrintStrategy(){
  return `${coliseumStrategy.name} :\n` + 
          coliseumStrategy.steps.map( (x) => `Time: ${x.time.length=== 4? '0' + x.time : x.time}, Nightmare: ${x.nightmare}, Player: ${x.user}`).join('\n');
}

function GetColiseumStrategy(){
  if (coliseumStrategy === undefined)
      return "Strategy is not defined";
  return PrettyPrintStrategy();
}

module.exports = {
  GetColiseumStrategy,
  GetShinmaInfo,

  SetColiseumStrategy,
  SetShinmaForColiseum,
  UnsetShinma
}