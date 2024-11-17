const express = require('express')
const bodyParser = require('body-parser')
const db = require('./index')

const app = express()
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000;

// POST
app.post("/create", (req, res) => {
  const data = req.body;
  const ref = db.ref("data");
  ref
    .push(data)
    .then(() => res.status(201).send("Data sent successfully"))
    .catch(error => res.status(400).send(error));
});

// READ
app.get("/read/:id", (req, res) => {
  const ref = db.ref("data/" + req.params.id);

  ref
    .once("value")
    .then(snapshot => res.status(200).send(snapshot.val()))
    .catch(error => res.status(400).send(error));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});