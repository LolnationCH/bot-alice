var nightmareOrder = require('../usr_data/order.json');

function PrettyPrint(nightmareInfo){
  return `${nightmareInfo.order}. ${nightmareInfo.name} launch by ${nightmareInfo.user}\n`
}


function GetColiseumNightmareInfo() {
  msg = ''
  for (var i = 0; i< nightmareOrder.order.length; i++){
    msg += PrettyPrint(nightmareOrder.order[i])
  }
  for (var i = 0; i< nightmareOrder.demons.length; i++){
    msg += PrettyPrint(nightmareOrder.demons[i])
  }
  for (var i = 0; i< nightmareOrder.counter.length; i++){
    msg += PrettyPrint(nightmareOrder.counter[i])
  }
  return msg
}


module.exports = {
  GetColiseumNightmareInfo
}