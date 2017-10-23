const measurements = require("express").Router();

measurements.get('/', (req, res) => {
  res.status(200).json({ message: 'no measurements yet!' });
});

module.exports = measurements;
