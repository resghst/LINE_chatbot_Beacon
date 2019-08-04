var linebot = require('@line/bot-sdk');
var config = require("../config/line_chatbot.json");

const client = new linebot.Client(config)

module.exports = client




// const fs = require('fs');

// fs.readFile('./config/line_chatbot.json', (err, data) => {
//   if (err) throw err;
//   var config = JSON.parse(data);
//   const client = new linebot.Client(config)

//   module.exports = client
// });