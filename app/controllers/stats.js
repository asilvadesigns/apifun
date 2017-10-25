const stats = require("express").Router();
const jsonpatch = require("fast-json-patch");
const moment = require("moment");

const model = require("../models/measurements.js");
const store = require("../store");

stats.get("/", (req, res) => {

  let param  = req.query.param;
  let stat   = req.query.stat;
  let metric = req.query.metric;
  let from   = req.query.fromDateTime;
  let to     = req.query.toDateTime;

  let dbquery;
  dbquery = store.measurements.filter((measurement) => {
    if (measurement.hasOwnProperty(metric)) return measurement;
  });

  res.status(200).json({
    heading: "querystring test...",
    message: {
      querystring: req.query,
      queryresult: dbquery
    }
  })
});

module.exports = stats;
