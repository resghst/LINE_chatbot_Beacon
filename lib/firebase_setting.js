
var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase.json");
var dbinfo = require("../config/firebase_info.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: dbinfo.databaseURL
});
let fireData = admin.database()
module.exports = fireData