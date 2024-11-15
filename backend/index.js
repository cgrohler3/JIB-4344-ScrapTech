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
  res.send('Backend Status: Active!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


//test code for accessing firestore and making a collection entry
app.get('/test-firestore', async (req, res) => {
  try {
    const docRef = db.collection('testCollection').doc('testDoc');
    await docRef.set({test: 'success'});
    res.send('Firestore connection successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Firestore connection failed');
  }
});



//export the initialized db
module.exports = db;