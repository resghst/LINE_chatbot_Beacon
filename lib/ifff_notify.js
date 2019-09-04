const axios = require('axios');
const IFFF_ifff_webhook_keykey = process.env.ifff_webhook_key

function handleEvent(notify_msg){
  return axios.post(
    'https://maker.ifttt.com/trigger/linechatbot/with/key/'+ifff_webhook_key,
    {
      value1: notify_msg.value1,
      value2: notify_msg.value2
    }
  )
  .then(function (response) {
    // Success
    console.log(notify_msg)
    console.log(response.status);
    console.log(response.data);
  })
  .catch(function (error) {
    // Error
    console.log('error\n\n===========\n\n');
    console.log(error);
    // // Error 的詳細資訊
    // console.log(error.response);  
  })
  .then(function () {
    console.log('always executed');
  })
}


module.exports = (notify_msg)=>{
  return Promise
    .all(handleEvent(notify_msg))
    .then((result) => {res.json(result)})
    .catch((err) => { console.error(err)});
}
