const measurements = require("express").Router();

const model = require("../models/measurements.js");
const store = require("../store");

measurements.get("/", (req, res) => {
  if (store.measurements.length === 0) {
    return res.status(404).json({
      heading: "no measurements...",
      message: store.measurements
    });
  }

  res.status(200).json(store.measurements);
});

measurements.get("/:timestamp", (req, res) => {
  let query = store.measurements.filter((measurement) => {
    if (measurement.timestamp === req.params.timestamp) {
      return measurement;
    }
  });

  if (!query || query.length === 0) {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: req.params.timestamp
    });
  }

  res.status(200).json({
    heading: "measurement found!",
    message: query
  });
});

measurements.post("/", (req, res) => {
  let valid = model.isValid(req.body);
  if (!valid.valid) {
    return res.status(400).json({
      heading: "invalid input...",
      message: valid.errors
    });
  }

  store.measurements.push(req.body);
  res.location("/measurements/" + req.body.timestamp);
  res.status(201).json({
    heading: "successfully posted...",
    message: req.body
  });
});

module.exports = measurements;
