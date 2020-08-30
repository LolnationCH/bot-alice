const got = require('got');
var removeDiacritics = require('diacritics').remove;

const url_feed = "https://sinoalice.game-db.tw/package/alice_nightmares-en.js";
const url_feed_global = "https://sinoalice.game-db.tw/package/alice_nightmaresglobal.js"; 

const RarityToStr = {
  1 : 'C',
  2 : 'B',
  3 : 'A',
  4 : 'S',
  5 : 'SR',
  6 : 'L'
}

/**
 * Parse the strObj to make the nightmare info object
 * @param {String} strObj string containing the nightmare information, split per props by '|'
 * @param {Array<string>} propsName array of string containing the names of the props for the nightmare
 */
function MakeNightmareObj(strObj, propsName){
    var values = strObj.split('|');
    var obj = {}
    for (var i =0; i < propsName.length; i++){
        obj[propsName[i]] = values[i];
    }

    obj["Url"] = `https://sinoalice.game-db.tw/nightmares/${obj["Name"]}`;
    var iconName = obj["Icon"];
    while (iconName.length < 4)
        iconName = '0' + iconName;
    obj["IconUrl"] = `https://sinoalice.game-db.tw/images/card/CardS${iconName}.png`;

    return obj;
}

/**
 * Returns a string containing important information about the nightmare
 * @param {NightmareObj} nightmareObj Nigthmare information
 */
function PrettyPrintNightmare(nightmareObj){
  return `Name : ${RarityToStr[nightmareObj.Rarity]} ${nightmareObj.NameEN}\n` +
         `Coliseum Skill     : ${nightmareObj.GvgSkillEN}\n`       +
         //`Skill details      : ${nightmareObj.GvgSkillDetail}\n`   +
         `Coliseum SP cost   : ${nightmareObj.GvgSkillSP}\n`     +
         `Coliseum Prep time : ${nightmareObj.GvgSkillLead}\n` +
         `Coliseum duration  : ${nightmareObj.GvgSkillDur}\n`   +
         `Link to database   : ${nightmareObj.Url}`;
}

/**
 * Filter the nigtmare based on the names wanted
 * @param {Array<NightmareObj>} Nightmares Array of nigthmare information
 * @param {Array<String>} nightmareNames Array of nightmare names
 */
function FilterByNightmareNames(Nightmares, nightmareNames) {
  var nightmareNamesLowered = nightmareNames.map((x) => x.toLowerCase());
  return Nightmares.filter((x) => {
    var isIncluded = false;
    nightmareNamesLowered.forEach((y) => {
      if (removeDiacritics(x.NameEN).toLowerCase().includes(y))
        isIncluded = true;
    });
    return isIncluded;
  });
}

/**
 * Filter the nightmare based on the skills wanted
 * @param {Array<NightmareObj>} Nightmares Array of nigthmare information
 * @param {Array<String>} skillNames Array of skill wanted
 */
function FilterByNightmareSkillName(Nightmares, skillNames) {
  var skillNamesLowered = skillNames.map((x) => x.toLowerCase());
  return Nightmares.filter((x) => {
    var isIncluded = false;
    skillNamesLowered.forEach((y) => {
      if (removeDiacritics(x.GvgSkillEN).toLowerCase().includes(y))
        isIncluded = true;
    });
    return isIncluded;
  });
}

/**
 * Returns the Nightmares information (jpn)
 */
async function GetNightmaresInfo(){
  const response = await got(url_feed);
  const body = await JSON.parse(response.body);
  
  var Nightmares = [];
  const propsName = body.Cols.split('|');
  body.Rows.forEach(element => {
      Nightmares.push(MakeNightmareObj(element, propsName));
  });
  return Nightmares;
}

/**
 * Returns the IDs of all the nightmare currently in global
 */
async function GetGlobalNightmaresIdAndName(){
  const response2 = await got(url_feed_global);
  const body2 = await JSON.parse(response2.body);
  const IDS = body2.ID.split('|'); // Array of id (string)
  const Names = body2.Name.split('|'); // Array of names (string)

  var NightmaresInfo = IDS.reduce((map, obj, index) => {
    map[obj] = Names[index];
    return map;
  }, {});
  
  return NightmaresInfo;
}

/**
 * Send a reply with the information asked.
 * @param {Message} msg Message object from Discord.js
 * @param {Array<String>} filterCondition Array of string containing the filter condition
 * @param {function} filterFunc Function to use to filter the nightmares with
 */
function GetNightmareInfo(msg, filterCondition, filterFunc){
  (async () => {
    try {
      var Nightmares = await GetNightmaresInfo();
      const globalNames = await GetGlobalNightmaresIdAndName();
      Nightmares = Nightmares.filter((x) => x.UniqueID in globalNames)
                             .map((x) => {
                                x.NameEN = globalNames[x.UniqueID];
                                return x;
                              });

      var nightInfo = filterFunc(Nightmares, filterCondition);
      
      if (nightInfo.length !== 0)
        msg.reply("\n" + nightInfo.map(x => PrettyPrintNightmare(x)).join('\n\n'));
      else
        msg.reply("No nightmare found");
      msg.delete({timeout:1000}); 
    } catch (error) {
      console.log(error);
    }
  })();
}

// GetNightmareInfo({reply: console.log, delete: ()=>{}}, ["Jorm"], FilterByNightmareNames);

module.exports = {
  GetNightmareInfo,
  FilterByNightmareNames,
  FilterByNightmareSkillName
}