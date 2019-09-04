//本日打卡資訊檢查
var moment = require('moment');
var _ = require('lodash');

async function check_clock_on(uid, fireData){
  let time_array = []
  let snap = await fireData.ref('BotTrain/Beacon').orderByChild("userId").equalTo(uid).once("value")

  let clock_check = async (snap)=>{
    //找出最近的打卡資訊
    const childData = snap.val();
    //該使用者第ㄧ次出現
    if(_.isNull(childData)){return true}
    
    //資料以時間排序
    Object.keys(childData).forEach(key=>{time_array.push(moment(childData[key].modifyTime))});
    time_array.sort()

    //檢查今日是否打卡
    let nearly_date = time_array[time_array.length-1].format("YYYY-MM-DD")
    let now_date = moment().format("YYYY-MM-DD")
    //本日已打卡
    if(moment(nearly_date).isSame(now_date)) {return false}
    //本日未打卡
    else {return true}
  }
  return await clock_check(snap)
  .catch(error => {console.log("error " + error)})
}
module.exports = check_clock_on