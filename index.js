const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//let data = fs.readFileSync('./measurements.json');
//let measurements = JSON.parse(data);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'hello world!' });
})

//app.get('/measurements', (req, res) => {
  //res.json(measurements);
//})

app.post('/measurements', (req, res) => {
  if (!req.body.timestamp) {
    return res.status(400).end();
  }

  let POST_DATA = JSON.stringify(req.body, null, 2);
  fs.writeFile('./measurements.json', POST_DATA, (err) => { console.log(err); });
  res.type('application/json');
  res.location(req.url + req.body.timestamp);
  res.status(201).end();
})

app.listen(3000, _ => {
  console.log('Server listenting on port ' + 3000 + ' ...');
})
