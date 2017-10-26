const stats = require("express").Router();
const jsonpatch = require("fast-json-patch");
const moment = require("moment");

const model = require("../models/measurements.js");
const store = require("../store");

stats.get("/", (req, res) => {

  const param  = req.query.param;
  const stat   = req.query.stat;
  const metric = req.query.metric;
  const from   = req.query.fromDateTime;
  const to     = req.query.toDateTime;
  let dbquery;

  if (Array.isArray(metric)) {
    metric.forEach((item) => {
      dbquery = store.measurements.filter((measurement) => {
        if (measurement.hasOwnProperty(item)) return measurement;
      });
    });
  } else {
    dbquery = store.measurements.filter((measurement) => {
      if (measurement.hasOwnProperty(metric)) return measurement;
    });
  }

  res.status(200).json({
    heading: "querystring test...",
    message: {
      querystring: req.query,
      queryresult: dbquery
    }
  })
});

module.exports = stats;
