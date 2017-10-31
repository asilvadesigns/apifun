const MODEL = require("../models");
const STORE = require("../store");
const UTILS = require("../utils");
const _     = require("lodash");

//
//  GET /measurements/
//  Get all items from the data store
const _get = (req, res) => {

  //  data store must not be empty
  if (_.isEmpty(STORE.measurements)) {
   return res.status(404).json({
      heading: "no measurements...",
      message: STORE.measurements
    });
  }

  res.status(200).json(STORE.measurements);

};

//
//  GET /measurements/:timestamp
//  Get an item from the data store by timestamp
const _getTimestamp = (req, res) => {

  const timestamp  = req.params.timestamp;
  let query        = [];

  //  GET request timestamp must be valid date or datetime, if so build 'query'.
  if (UTILS.moment.dateTime(timestamp).isValid()) {
    query = _.filter(STORE.measurements, obj => obj.timestamp === timestamp);
  } else if (UTILS.moment.date(timestamp).isValid()) {
    query = _.filter(STORE.measurements, obj => obj.timestamp.includes(timestamp));
  } else {
    return res.status(400).json({
      heading: "invalid date or datetime request...",
      message: timestamp
    });
  }

  //  GET data store query must not be empty
  if (_.isEmpty(query)) {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: timestamp
    });
  }

  res.status(200).json({
    heading: "measurement found!",
    message: query
  });
};

//  
//  POST /measurements/
//  Add a new item to the data store.
const _post = (req, res) => {

  const timestamp = req.body.timestamp;
  const schema    = MODEL.measurements.isValid(req.body);

  //  POST request timestamp must be valid datetime
  if (!UTILS.moment.dateTime(timestamp).isValid()) {
    return res.status(400).json({
      heading: "invalid request timestamp format...",
      message: timestamp
    })
  }

  //  POST request must have valid schema
  if (!schema.valid) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: schema.errors
    });
  }

  //  POST request must not exist in data store, if so add to data store
  if (!_.findKey(STORE.measurements, ["timestamp", timestamp])) {
    STORE.measurements.push(req.body);
  } else {
    return res.status(400).json({
      heading: "timestamp already exists...",
      message: timestamp
    });
  }

  res.location("/measurements/" + timestamp);
  res.status(201).json({
    heading: "successfully posted...",
    message: req.body
  });

}

//  
//  PUT /measurements/
//  Put a new item to the data store.
const _putTimestamp = (req, res) => {

  const timestamp = req.params.timestamp;
  const schema    = MODEL.measurements.isValid(req.body);
  let update      = [];

  //  PUT request timestamp must be valid datetime
  if (!UTILS.moment.dateTime(timestamp).isValid()) {
    return res.status(400).json({
      heading: "invalid timestamp...",
      message: timestamp
    });
  }

  //  PUT request must have valid schema
  if (!schema.valid) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: schema.errors
    });
  }

  //  PUT request body and param timestamp must be identical
  if (timestamp !== req.body.timestamp) {
    return res.status(409).json({
      heading: "timestamp conflict in request...",
      message: timestamp
    });
  }

  //  PUT request must exist in data store, if so build 'update'
  if (_.find(STORE.measurements, ["timestamp", timestamp])) {
    update = _.map(STORE.measurements, obj => obj.timestamp === timestamp ? req.body : obj);
  } else {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: timestamp
    });
  }

  STORE.measurements = update;

  res.status(204).json({
    heading: "successfully updated...",
    message: STORE.measurements
  });

}

//
//  PATCH /measurements/:timestamp
//  Patch an item from the data store by timestamp
const _patchTimestamp = (req, res) => {

  const timestamp = req.params.timestamp;
  const schema    = MODEL.measurements.isValid(req.body);
  let update      = [];

  //  PATCH request timestamp must be valid datetime
  if (!UTILS.moment.dateTime(timestamp).isValid()) {
    return res.status(400).json({
      heading: "invalid timestamp...",
      message: timestamp
    });
  }

  //  PATCH request must have valid schema
  if (!schema.valid) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: schema.errors
    });
  }

  //  PATCH request must exist in data store, if so build and validate 'update'
  let errors;
  if (_.find(STORE.measurements, ["timestamp", timestamp])) {
    [errors, update] = UTILS.measurements.generatePatch(req, timestamp);
  } else {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: timestamp
    });
  }

  if (errors) {
    return res.status(400).json({
      heading: "invalid body schema...",
      message: errors
    });
  }

  STORE.measurements = update;

  res.status(204).json({
    heading: "successfully updated...",
    message: STORE.measurements
  });

}

//
//  DELETE /measurements/:timestamp
//  Delete an item from the data store by timestamp
const _deleteTimestamp = (req, res) => {

  const request = req.params.timestamp;
  let update    = [];

  //  DELETE request timestamp must be valid datetime
  if (!UTILS.moment.dateTime(request).isValid()) {
    return res.status(400).json({
      heading: "invalid timestamp...",
      message: request
    });
  }

  //  DELETE request must exist in data store, if so build 'update'
  if (_.find(STORE.measurements, ["timestamp", request])) {
    update = _.filter(STORE.measurements, obj => obj.timestamp !== request ? obj : null);
  } else {
    return res.status(404).json({
      heading: "timestamp not found...",
      message: request
    });
  }

  STORE.measurements = update;

  res.status(204).json({
    heading: "successfully deleted...",
    message: STORE.measurements
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