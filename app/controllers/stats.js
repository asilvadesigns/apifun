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

  let checkfrom = moment(from, 'YYYY-MM-DDTHH:mm:ss.sssZ', true);
  if (!checkfrom.isValid()) {
    return res.status(400).json({
      heading: "invalid fromDateTime format...",
      message: from
    });
  }

  let checkto = moment(to, 'YYYY-MM-DDTHH:mm:ss.sssZ', true);
  if (!checkto.isValid()) {
    return res.status(400).json({
      heading: "invalid toDateTime format...",
      message: to
    });
  }

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
  dbquery   = _.slice(dbquery, alpha, omega);

  let min     = _.minBy(dbquery, metric);
  let max     = _.maxBy(dbquery, metric);
  let average = _.meanBy(dbquery, metric);

  min     = min[metric]
  max     = max[metric]
  average = Math.round(average * 10) / 10;

  statistics = [
    {
      metric: metric,
      stat: "min",
      value: min
    },
    {
      metric: metric,
      stat: "max",
      value: max
    },
    {
      metric: metric,
      stat: "average",
      value: average
    },
  ]

  res.status(200).json({
    heading: "querystring test...",
    message: {
      querystring: req.query,
      queryresult: dbquery,
      statistics: statistics
    }
  })
});

module.exports = stats;
