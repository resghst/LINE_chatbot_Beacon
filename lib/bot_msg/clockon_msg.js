let moment = require('moment');
let _ = require('lodash');

let img = ["https://scontent-sea1-1.cdninstagram.com/v/t51.2885-15/e35/13187949_1740700206153431_1519067107_n.jpg?_nc_ht=scontent-sea1-1.cdninstagram.com&oh=d7e81d979d181f5dfd9803fb77f58a8d&oe=5E0CD096&ig_cache_key=MTI1MDc2MzU4NjcxNDA1MDczOA%3D%3D.2","https://stickershop.line-scdn.net/stickershop/v1/product/1273496/LINEStorePC/main.png;compress=true"]


exports.sampleimg = (img) => {
  return _.sample(img);
}



exports.back_msg = (profile, event) => {
  let data_msg = {}
  if(event.hwid === '012e4975c9') {data_msg['position'] = '前門'}
  data_msg['name'] = profile.displayName
  data_msg['txnTime'] = moment(event.timestamp).format("YYYY年MM月DD日　HH:mm:ss")
  data_msg['exitTime'] = moment(event.timestamp).add(9, 'hours').format("YYYY年MM月DD日　HH:mm:ss")
  data_msg['actioin'] = "進入"
  // data_msg['position'] = "前門"
  return data_msg
}


exports.btn_msg = (hwid) => {
  return {
    type: 'flex',
    altText: 'btn',
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            color: '#1DB446',
            size: 'lg',
            type: 'text',
            weight: 'bold',
            text: "打 卡 訊 息"
          },
          {
            type: "separator",
            color: '#1DB446',
          },
        ]
      },
      hero: {
        type: "image",
        url: exports.sampleimg(img),
        size: "full",
        aspectRatio: "2:1"
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            size: "md",
            align: "center",
            wrap: true,
            contents: [
              {
                type: "span",
                text: "已偵測進入區域：",
              },
              {
                type: "span",
                text: "前門",
                color: "#1DB446",
                weight: "bold",
              },
              {
                type: "span",
                text: "，\n如要打卡請按確認鍵。",
              },
              
            ]
          }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
          type: "button",
          style: "primary",
          action: {  
            type:"postback",
            label:"我要打卡",
            data:"action=clock_on&hwid="+hwid,
          }
          }
        ]
      }
    }
  }
}

