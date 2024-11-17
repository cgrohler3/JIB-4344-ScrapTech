const admin = require('firebase-admin')
const serviceAccount = require('./scraplanta-dashboard-firebase-adminsdk-fazlk-3a465b9a8a.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://scraplanta-dashboard-default-rtdb.firebaseio.com/",
})

const db = admin.database()
module.exports = db;