const AJV = require("ajv");
const ajv = new AJV({ allErrors: true });

const measurements = require("express").Router();

const schema = require("../models/measurements.js");

measurements.get('/', (req, res) => {
  res.status(200).json({ message: 'no measurements yet!' });
});

measurements.post('/', (req, res) => {

  let valid = ajv.validate(schema, req.body);
  if (!valid) {
    return res.status(400).json({
      heading: 'invalid input...',
      message: ajv.errors
    });
  }

  res.status(201).json({
    heading: 'successfully posting...',
    message: req.body
  });
});

module.exports = measurements;
