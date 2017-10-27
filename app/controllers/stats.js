const stats     = require("express").Router();
const jsonpatch = require("fast-json-patch");
const moment    = require("moment");
const _         = require("lodash");

const model = require("../models/measurements.js");
const store = require("../store");

stats.get("/", (req, res) => {

  const stat    = req.query.stat;
  const metric  = req.query.metric;
  const from    = req.query.fromDateTime;
  const to      = req.query.toDateTime;
  let dbquery   = [];
  let statcheck = [];

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

  dbquery   = _.sortBy(store.measurements, "timestamp", 'asc');
  let alpha = _.findIndex(dbquery, { "timestamp": from });
  let omega = _.findIndex(dbquery, { "timestamp": to });
  dbquery   = _.slice(dbquery, alpha, omega);

  if (Array.isArray(metric)) {
    metric.forEach((item) => {
      statcheck = store.measurements.filter((measurement) => {
        if (measurement.hasOwnProperty(item)) return measurement;
      });
    });
  } else {
    statcheck = store.measurements.filter((measurement) => {
      if (measurement.hasOwnProperty(metric)) return measurement;
    });
  }

  //  this should be 200
  if (!statcheck || statcheck.length === 0) {
    return res.status(400).json({
      heading: "invalid metric...",
      message: metric
    })
  }

  let statistics = [];
  if (Array.isArray(metric)) {
    metric.forEach((item) => {
      statistics.push({
        "metric": item,
        "min": _.minBy(dbquery, item)[item],
        "max": _.maxBy(dbquery, item)[item],
        "avg": Math.round(_.meanBy(dbquery, item) * 10) / 10,
      });
    });
  }

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
