const measurements = require("express").Router();

measurements.get('/', (req, res) => {
  res.status(200).json({ message: 'no measurements yet!' });
});

measurements.post('/', (req, res) => {
  res.status(201).json({
    message: 'attempting to post here...',
    posting: req.body
  });
});

module.exports = measurements;
