const UTILS = require("../utils");

const measurements = require("express").Router();
const jsonpatch    = require("fast-json-patch");
const moment       = require("moment");
const _            = require("lodash");

const model = require("../models/measurements.js");
const store = require("../store");

measurements.get("/", (req, res) => {

  if (_.isEmpty(store.measurements)) {
    return res.status(404).json({
      heading: "no measurements...",
      message: store.measurements
    });
  }

  res.status(200).json(store.measurements);

});

measurements.get("/:timestamp", (req, res) => {

  const date     = req.params.timestamp;
  const datetime = req.params.timestamp;
  const request  = req.params.timestamp;
  let query      = [];

  if (UTILS.moment.dateTime(datetime).isValid()) {
    query = store.measurements.filter((measurement) => {
      if (measurement.timestamp === request) return measurement;
    });
  } else if (UTILS.moment.date(date).isValid()) {
    query = store.measurements.filter((measurement) => {
      if (measurement.timestamp.includes(request)) return measurement;
    });
  } else {
    return res.status(400).json({
      heading: "invalid date or datetime request...",
      message: request
    });
  }

  if (_.isEmpty(query)) {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: request
    });
  }

  res.status(200).json({
    heading: "measurement found!",
    message: query
  });

});

measurements.post("/", (req, res) => {

  const timestamp = req.body.timestamp;
  const schema    = model.isValid(req.body);

  if (!UTILS.moment.dateTime(timestamp).isValid()) {
    return res.status(400).json({
      heading: "invalid request timestamp format...",
      message: timestamp 
    })
  }

  if (!schema.valid) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: schema.errors
    });
  }

  if (!_.findKey(store.measurements, ["timestamp", timestamp])) {
    store.measurements.push(req.body);
  } else {
    return res.status(400).json({
      heading: "timestamp already exists...",
      message: req.body
    });
  }

  res.location("/measurements/" + timestamp);
  res.status(201).json({
    heading: "successfully posted...",
    message: req.body
  });

});

measurements.put("/:timestamp", (req, res) => {

  const request = req.params.timestamp;
  const schema  = model.isValid(req.body);
  let update    = [];

  if (!UTILS.moment.dateTime(request).isValid()) {
    return res.status(400).json({
      heading: "invalid timestamp...",
      message: request
    });
  }

  if (!schema.valid) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: schema.errors
    });
  }

  if (request !== req.body.timestamp) {
    return res.status(409).json({
      heading: "timestamp conflict in request...",
      message: request
    });
  }

  if (_.findKey(store.measurements, ["timestamp", request])) {
    update = store.measurements.map((measurement) => {
      return (measurement.timestamp === request) ? req.body : measurement;
    });
  } else {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: request
    });
  }

  store.measurements = update;

  //  TODO: use this - res.status(204).json({
  res.status(200).json({
    heading: "successfully updated...",
    message: store.measurements
  });
});

measurements.patch("/:timestamp", (req, res) => {

  const request = req.params.timestamp;
  const schema  = model.isValid(req.body);
  let update    = [];

  if (!UTILS.moment.dateTime(request).isValid()) {
    return res.status(400).json({
      heading: "invalid timestamp...",
      message: request
    });
  }

  if (!schema.valid) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: schema.errors
    });
  }

  let updateschemaerrors;
  if (_.findKey(store.measurements, ["timestamp", request])) {
    update = store.measurements.map((measurement) => {
      if (measurement.timestamp === request) {
        let patcheditem = jsonpatch.applyPatch(measurement, req.body, true).newDocument;
        let schema = model.isValid(patcheditem);
        if (!schema.valid) {
          updateschemaerrors = schema.errors
        } else {
          return patcheditem;
        }
      } else {
        return measurement;
      }
    });
  } else {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: request
    });
  }

  if (updateschemaerrors) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: updateschemaerrors
    });
  }

  store.measurements = update;

  //  TODO: use this - res.status(204).json({
  res.status(200).json({
    heading: "successfully updated...",
    message: store.measurements
  });

});

measurements.delete("/:timestamp", (req, res) => {

  const request = req.params.timestamp;
  let update    = [];

  if (!UTILS.moment.dateTime(request).isValid()) {
    return res.status(400).json({
      heading: "invalid timestamp...",
      message: request
    });
  }

  if (_.findKey(store.measurements, ["timestamp", request])) {
    update = store.measurements.filter((measurement) => {
      if (measurement.timestamp !== request) return measurement;
    });
  } else {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: request
    });
  }

  store.measurements = update;

  //  TODO: use this - res.status(204).json({
  res.status(200).json({
    heading: "successfully deleted...",
    message: store.measurements
  });
});

module.exports = measurements;