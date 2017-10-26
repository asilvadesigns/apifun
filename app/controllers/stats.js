const stats     = require("express").Router();
const jsonpatch = require("fast-json-patch");
const moment    = require("moment");
const _         = require("lodash");

const model = require("../models/measurements.js");
const store = require("../store");

stats.get("/", (req, res) => {

  const param  = req.query.param;
  const stat   = req.query.stat;
  const metric = req.query.metric;
  const from   = req.query.fromDateTime;
  const to     = req.query.toDateTime;
  let dbquery  = [];

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

  //  this should always be sorted...
  //dbquery = _.sortBy(dbquery, "timestamp");

  let alpha = _.findIndex(dbquery, { "timestamp": from });
  let omega = _.findIndex(dbquery, { "timestamp": to });

  dbquery = _.slice(dbquery, alpha, omega);
  let min = _.minBy(dbquery, metric);
  let max = _.maxBy(dbquery, metric);
  let avg = _.meanBy(dbquery, metric);
      avg = Math.floor(avg * 10) / 10;

  res.status(200).json({
    heading: "querystring test...",
    message: {
      querystring: req.query,
      queryresult: dbquery,
      minimum: min,
      maximum: max,
      average: avg
    }
  })
});

module.exports = stats;
