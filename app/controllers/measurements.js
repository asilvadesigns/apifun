const UTILS      = require("../utils");
const _          = require("lodash");
const jsonpatch  = require("fast-json-patch");
const model      = require("../models/measurements.js");
const store      = require("../store");

const _get = (req, res) => {

  if (_.isEmpty(store.measurements)) {
    return res.status(404).json({
      heading: "no measurements...",
      message: store.measurements
    });
  }

  res.status(200).json(store.measurements);

};

const _getTimestamp = (req, res) => {

  const date     = req.params.timestamp;
  const datetime = req.params.timestamp;
  const request  = req.params.timestamp;
  let query      = [];

  if (UTILS.moment.dateTime(datetime).isValid()) {
    query = store.measurements.filter(measurement => {
      if (measurement.timestamp === request) return measurement;
    });
  } else if (UTILS.moment.date(date).isValid()) {
    query = store.measurements.filter(measurement => {
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
};

const _post = (req, res) => {

  const timestamp = req.body.timestamp;
  const schema    = model.isValid(req.body);

  //  TODO: check for case sensitivity in postrequest...
  //  or find out how to use ajv case sensitive validation

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

}

const _putTimestamp = (req, res) => {

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

  //  TODO: this should be 204
  res.status(200).json({
    heading: "successfully updated...",
    message: store.measurements
  });

}

const _patchTimestamp = (req, res) => {
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

  //  TODO: this should be 204
  res.status(200).json({
    heading: "successfully updated...",
    message: store.measurements
  });

}

const _deleteTimestamp = (req, res) => {

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

  //  TODO: this should be 204
  res.status(200).json({
    heading: "successfully deleted...",
    message: store.measurements
  });

}

module.exports = {
  get: _get,
  getTimestamp: _getTimestamp,
  post: _post,
  putTimestamp: _putTimestamp,
  patchTimestamp: _patchTimestamp,
  deleteTimestamp: _deleteTimestamp
};
