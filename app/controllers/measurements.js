const measurements = require("express").Router();
const jsonpatch = require("fast-json-patch");
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

  const date     = moment(req.params.timestamp, 'YYYY-MM-DD', true);
  const datetime = moment(req.params.timestamp, 'YYYY-MM-DDTHH:mm:ss.sssZ', true);
  const request  = req.params.timestamp;
  let query      = [];

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
      heading: "invalid date or datetime request...",
      message: request
    });
  }

  if (!query || query.length === 0) {
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

  let valid = model.isValid(req.body);
  if (!valid.valid) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: valid.errors
    });
  }

  let reqexists = false;
  store.measurements.forEach((measurement) => {
    if (measurement.timestamp === req.body.timestamp) reqexists = true;
  });

  if (!reqexists) {
    store.measurements.push(req.body);
  } else {
    return res.status(400).json({
      heading: "timestamp already exists...",
      message: req.body
    });
  }

  res.location("/measurements/" + req.body.timestamp);
  res.status(201).json({
    heading: "successfully posted...",
    message: req.body
  });

});

measurements.put("/:timestamp", (req, res) => {

  const request = req.params.timestamp;
  let update    = [];

  let datetime = moment(request, 'YYYY-MM-DDTHH:mm:ss.sssZ', true);
  if (!datetime.isValid()) {
    return res.status(400).json({
      heading: "invalid timestamp...",
      message: request
    });
  }

  let reqbody = model.isValid(req.body);
  if (!reqbody.valid) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: reqbody.errors
    });
  }

  if (request !== req.body.timestamp) {
    return res.status(409).json({
      heading: "timestamp conflict in request...",
      message: request
    });
  }

  let reqexists = false;
  store.measurements.forEach((measurement) => {
    if (measurement.timestamp === request) reqexists = true;
  });

  if (reqexists) {
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
  let update    = [];

  let datetime = moment(request, 'YYYY-MM-DDTHH:mm:ss.sssZ', true);
  if (!datetime.isValid()) {
    return res.status(400).json({
      heading: "invalid timestamp...",
      message: request
    });
  }

  let reqbody = model.isValid(req.body);
  if (!reqbody.valid) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: reqbody.errors
    });
  }

  //TODO: assuming we use json patch, this should never happen.
  //if (request !== req.body.timestamp) {
  //  return res.status(409).json({
  //    heading: "timestamp conflict in request...",
  //    message: request
  //  });
  //}

  let reqexists = false;
  store.measurements.forEach((measurement) => {
    if (measurement.timestamp === request) reqexists = true;
  });

  let updateschemaerrors;
  if (reqexists) {
    update = store.measurements.map((measurement) => {
      if (measurement.timestamp === request) {
        let updateditem = jsonpatch.applyPatch(measurement, req.body, true).newDocument;
        let schemacheck = model.isValid(updateditem);
        if (!schemacheck.valid) {
          updateschemaerrors = schemacheck.errors
        } else {
          return updateditem;
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

  let datetime = moment(request, 'YYYY-MM-DDTHH:mm:ss.sssZ', true);
  if (!datetime.isValid()) {
    return res.status(400).json({
      heading: "invalid timestamp...",
      message: request
    });
  }

  let reqexists = false;
  store.measurements.forEach((measurement) => {
    if (measurement.timestamp === request) reqexists = true;
  });

  if (reqexists) {
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
