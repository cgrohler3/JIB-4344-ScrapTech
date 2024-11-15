const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAcc = require('./firebaseConfig/servAcc.json');
require('dotenv').config;

//init firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAcc),
})

const db = admin.firestore();
//server named 'app'
const app = express();
//port 3000 for development
const port = 3000;

app.get('/', (req, res) => {
  res.send('Help!!!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});




module.exports = db;