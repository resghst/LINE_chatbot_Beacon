let moment = require('moment');

function position_pass(hwid){
  if(hwid === '012e4975c9') {return '前門'}
}
module.exports = ( profile, event ) => ({
  "userId" : event.source.userId,
  "name" : profile.displayName,
  "txnTime" : event.timestamp,
  "exitTime" : moment(event.timestamp).add(9, 'hours').valueOf(),
  "createTime" : moment().valueOf(),
  "modifyTime" : moment().valueOf(),
  "position": position_pass(event.hwid)
})


