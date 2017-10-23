const measurements = require("express").Router();

measurements.get('/', (req, res) => {
  res.status(200).json({ message: 'no measurements yet!' });
});

measurements.post('/', (req, res) => {

  if (typeof(req.body.timestamp) !== "string") {
    return res.status(400).json({
      message: 'timestamp must be a string',
      posting: req.body.timestamp
    });
  }

  if (typeof(req.body.temperature) !== "number") {
    return res.status(400).json({
      message: 'temperature must be a number',
      posting: req.body.temperature
    });
  }

  res.status(201).json({
    message: 'attempting to post here...',
    posting: req.body
  });
});

module.exports = measurements;
