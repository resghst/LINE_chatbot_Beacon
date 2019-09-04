const _ = require('lodash')
const axios = require('axios')
const Qs = require('qs')
var URL = require('url').URL;
var fireData = require('./firebase_setting')
let host = process.env.hostname

const LINE_NOTIFY_ID = process.env.LINE_NOTIFY_ID
const LINE_NOTIFY_SECRET = process.env.LINE_NOTIFY_SECRET
const LINE_NOTIFY_BOT_APIBASE = 'https://notify-bot.line.me'
const LINE_NOTIFY_API_APIBASE = 'https://notify-api.line.me'


exports.httpBuildQuery = obj => Qs.stringify(obj, { arrayFormat: 'brackets' })

exports.siteUrl = (dataurl, req) => {
    // const base = `https://${req.hostname}${req.originalUrl}`
    return new URL('https://'+ host +'/notifyauth').href
}

exports.getStateCode = () => {
  let str = "";
  let code_arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  for(var i=0;i<10;i++){str += code_arr[Math.round(Math.random()*(code_arr.length-1))]}
  return str;
}

exports.createAuthorizeParams = (req) => ({
  response_type: 'code',
  client_id: LINE_NOTIFY_ID,
  redirect_uri: exports.siteUrl('/notifyauth', host),
  scope: 'notify',
  state: exports.getStateCode(),
  response_mode: 'form_post',
})

exports.getAuthorizeUrl = params => `${LINE_NOTIFY_BOT_APIBASE}/oauth/authorize?${exports.httpBuildQuery(params)}`

exports.fetchTokenByCode = async (req_body, redirectUri) => {
  let {code, state} = req_body
  await fireData.ref('Notify/unauth').orderByChild("state").equalTo(state).once("value")
  .then(async(snap)=>{
    let data = snap.val()
    let uid = data[Object.keys(data)[0]].uid
    if(_.isEmpty(data)){return Promise.resolve(null)}
      
    const body = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: new URL('https://'+host+'/notifyauth').href,
      client_id: LINE_NOTIFY_ID,
      client_secret: LINE_NOTIFY_SECRET,
    }
    console.log(body)
    console.log(`${LINE_NOTIFY_BOT_APIBASE}/oauth/token`)
    const res = await axios.post(`${LINE_NOTIFY_BOT_APIBASE}/oauth/token`, exports.httpBuildQuery(body))
    .catch(e=>console.log(e))
    const token = _.get(res, 'data.access_token')
    await fireData.ref('Notify/auth').push({uid,token})
    await fireData.ref('Notify/unauth').orderByChild("uid").equalTo(uid).once("value")
    .then(async (snap)=>{await fireData.ref("Notify/unauth/"+Object.keys(data)[0]).set({})})
    return token
  })
}

exports.SentNotify = async (accessToken) => {
  let message="感謝你為國家的付出，可以下班了！！！"
  const body = {message}
  const res = await axios.post(`${LINE_NOTIFY_API_APIBASE}/api/notify`, exports.httpBuildQuery(body), {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  .catch(e=>console.log(e))
  const status = _.get(res, 'data.status')
  return status
}

exports.StatusNotify = async (accessToken) => {
  const res = await axios.get(`${LINE_NOTIFY_API_APIBASE}/api/status`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  .catch(e=>console.log(e))
  console.log(res.data)
  const status = _.get(res, 'data.status')
  return status
}
