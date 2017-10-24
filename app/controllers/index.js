const ROUTES = require("express").Router();

const measurements = require("./measurements.js");

ROUTES.use('/measurements', measurements);

ROUTES.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

module.exports = ROUTES;
