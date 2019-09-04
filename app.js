require('dotenv').config()

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const { getenv } = require('./lib/helper');
var moment = require('moment');
const _ = require('lodash');
const Qs = require('qs')

var Queue = require('bull');
var clockoff = new Queue('clockoff', {
  redis: {
    port: 6379, // Redis port
    host: "0.0.0.0", // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    db: 1
  }
});

clockoff
.on('error',async function (error) {
  await console.error(`Error in bull queue happend: ${error}`);
})

const APP_PORT = getenv('PORT', 3000);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var client = require('./lib/init_line_eat');
var daily_clock_on = require('./lib/daily_clock_on');
var notify = require('./lib/ifff_notify');

app.use('/', routes);
app.use('/users', users);

var fireData = require('./lib/firebase_setting'); //取得Firebase的database
var beacon_msg = require('./lib/linebeacon_post'); //取得Beacon的訊息
var db_btrain = require('./lib/db/beacon_train'); //打卡存firebase Beacon的格式
var clockon_msg = require('./lib/bot_msg/clockon_msg');//打卡回覆訊息的格式

const lnotify = require('./lib/notify');

// line chatbot
app.post('/linewebhook', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {res.json(result)})
    .catch((err) => { console.error(err)});
});
async function handleEvent(event) {
  let profile = await client.getProfile(event.source.userId)
  let classify_type = async(profile)=>{
    if(event.type === 'postback'){
      let data = Qs.parse(event.postback.data)
      if(data.action=='clock_on'){
        event.hwid = data.hwid
        let get_data = db_btrain(profile, event)
        let data_msg = clockon_msg.back_msg(profile, event)
        
        //檢查打卡資訊並儲存
        if(await daily_clock_on(get_data.userId, fireData)){
          fireData.ref('BotTrain/Beacon').push(get_data)
          let difftime = moment(get_data.exitTime).diff(moment(get_data.createTime))
          clockoff.add({uid:event.source.userId},{ delay: difftime });
          return client.replyMessage(event.replyToken, beacon_msg({
              ctx:data_msg, event:{action:'打卡訊息'}
            })
          )
        }
        //本日已打卡
        else {return }  
      }
    }

    if(event.type === 'message'){ 
      console.log('this is message')
      let msg = event.message.text
      if(msg == '/notify'){
        let parms = await lnotify.createAuthorizeParams({})
        console.log(parms, '\n', event)
        let uid = event.source.userId
        let state = parms.state
        console.log({uid, state})
        let snap = await fireData.ref('Notify/unauth').orderByChild("uid").equalTo(uid).once("value")
        let data = snap.val()
        if(_.isEmpty(data)) await fireData.ref('Notify/unauth').push({uid,state})
        else{
          Object.keys(data).forEach(key=>{data[key].state = state});
          await fireData.ref('Notify/unauth').update(data)
        }
        return await client.replyMessage(event.replyToken, {type: 'text', text: lnotify.getAuthorizeUrl(parms)})
      }
    }  

    if(event.type === 'beacon' && event.beacon.type === 'enter'){
      console.log('this is beacon enter')
      //檢查打卡資訊
      if(await daily_clock_on(event.source.userId, fireData)){
        let data_msg = clockon_msg.btn_msg(event.beacon.hwid)
        return client.replyMessage(event.replyToken, ctx=data_msg)
      }
      //本日已打卡
      else {return }
    }
    return 
  }
  await classify_type(profile)
  .catch(err=>{console.log(err)})
}

clockoff.process(async function(job, done){
  console.log(job.id, job.data)
  let snap = await fireData.ref('Notify/auth').orderByChild("uid").equalTo(job.data.uid).once("value")
  let work_create = async (snap)=>{
    let data = snap.val()
    if(_.isEmpty(data)){return }
    let token = data[Object.keys(data)[0]].token
    let finish = await lnotify.SentNotify(token)
    if(finish) done();
    else throw new Error('some unexpected error');
  }
  work_create(snap)
  .catch((err)=>{console.log(err)})
});





/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
