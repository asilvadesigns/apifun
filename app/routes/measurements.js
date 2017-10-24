const measurements = require("express").Router();

const schema = require("../models/measurements.js");

measurements.get("/", (req, res) => {
  res.status(200).json({ message: "no measurements yet!" });
});

measurements.post("/", (req, res) => {

  let valid = schema.isValid(req.body);
  if (!valid.valid) {
    return res.status(400).json({
      heading: "invalid input...",
      message: valid.errors
    });
  }

  res.location("/measurements/" + req.body.timestamp);
  res.status(201).json({
    heading: "successfully posting...",
    message: req.body,
  });

});

module.exports = measurements;
