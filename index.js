const CONFIG = require('./config');
const DATA   = require('./measurements.json');

const fs = require('fs');
const _  = require('lodash');

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'hello world!' });
});

app.get('/measurements', (req, res) => {
  res.json(DATA);
});

app.post('/measurements', (req, res) => {
  if (!req.body.timestamp) {
    return res.status(400).end();
  }

  DATA.measurements.push(req.body);
  fs.writeFile('./measurements.json', JSON.stringify(DATA, null, 2), err => {
    if (err) console.log(err);
  });

  res.type('application/json');
  res.location(req.url + req.body.timestamp);
  res.status(201).end();
});

app.listen(3000, _ => {
  console.log('Server listenting on port ' + 3000 + ' ...');
});
