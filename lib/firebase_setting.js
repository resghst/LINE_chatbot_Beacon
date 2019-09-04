
var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase.json");
var databaseURL = process.env.fire_base_databaseURL

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL
});
let fireData = admin.database()
module.exports = fireData