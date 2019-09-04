var linebot = require('@line/bot-sdk');
// var config = require("../config/line_chatbot.json");
let config ={
    channelId: process.env.channelId, 
    channelSecret: process.env.channelSecret, 
    channelAccessToken: process.env.channelAccessToken, 
}
const client = new linebot.Client(config)

module.exports = client