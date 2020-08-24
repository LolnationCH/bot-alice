const shinma_infos = require('../game_data/shinma_info.json');

var shinmaInfo1 = undefined;
var shinmaInfo2 = undefined;

/**
 * 
 * @param {String} shinmaName1 
 * @param {String} shinmaName2 
 */
function SetShinmaForColiseum(shinmaName1, shinmaName2){
    shinma_infos.forEach( (x) => {
        if (x.name.toLowerCase().includes(shinmaName1.toLowerCase()))
            shinmaInfo1 = x;
        else if (x.name.toLowerCase().includes(shinmaName2.toLowerCase()))
            shinmaInfo2 = x
    })
}

function UnsetShinma(){
    shinmaInfo1 = undefined;
    shinmaInfo2 = undefined;
}

function _GetShinmaInfo(prefix, shinmaInfo){
    if (shinmaInfo === undefined)
        return [`${prefix} is undefined`]
    if (shinmaInfo.url_img !== "")
        return [prefix, {files:[shinmaInfo.url_img]}]
    else 
        return [`${prefix}\nName : ${shinmaInfo.name}\nCall conditions : ${shinmaInfo.call_conditions.join(",")}`, {}]
}

function GetShinmaInfo(){
    return [
        _GetShinmaInfo("First Demon", shinmaInfo1),
        _GetShinmaInfo("Second Demon", shinmaInfo2),
    ]
}

module.exports = {
    GetShinmaInfo,
    SetShinmaForColiseum,
    UnsetShinma
}