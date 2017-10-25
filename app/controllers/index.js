const ROUTES = require("express").Router();

const measurements = require("./measurements.js");
const stats = require("./stats.js");

ROUTES.use('/measurements', measurements);
ROUTES.use('/stats', stats);

ROUTES.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

module.exports = ROUTES;
