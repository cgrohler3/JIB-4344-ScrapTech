const express = require('express');
const cors = require('cors');
require('dotenv').config;

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