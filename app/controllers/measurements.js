const measurements = require("express").Router();

const moment = require("moment");

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

  let date     = moment(req.params.timestamp, 'YYYY-MM-DD', true);
  let datetime = moment(req.params.timestamp, 'YYYY-MM-DDTHH:mm:ss.sssZ', true);
  let request  = req.params.timestamp;
  let query;

  if (datetime.isValid()) {
    query = store.measurements.filter((measurement) => {
      if (measurement.timestamp === request) return measurement;
    });
  } else if (date.isValid()) {
    query = store.measurements.filter((measurement) => {
      if (measurement.timestamp.includes(request)) return measurement;
    });
  } else {
    return res.status(400).json({
      heading: "bad request...",
      message: request
    });
  }

  if (!query || query.length === 0) {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: request
    });
  } else {
    return res.status(200).json({
      heading: "measurement found!",
      message: query
    });
  }
});

measurements.get("/:date", (req, res) => {

  let date = moment(req.params.date, 'YYYY-MM-DD', true);
  if (!date.isValid()) {
    return res.status(404).json({
      heading: "date is not valid...",
      message: req.params.date
    });
  }

  let query = store.measurements.filter((measurement) => {
    if (measurement.timestamp.includes(date)) {
      return measurement;
    }
  });

  if (!query || query.length === 0) {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: req.params.date
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
