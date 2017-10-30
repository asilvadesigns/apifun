const UTILS = require("../utils");

const stats     = require("express").Router();
const jsonpatch = require("fast-json-patch");
const moment    = require("moment");
const _         = require("lodash");

const model = require("../models/measurements.js");
const store = require("../store");

stats.get("/", (req, res) => {

  const stats     = (!Array.isArray(req.query.stat)) ? [req.query.stat] : req.query.stat;
  const metrics   = (!Array.isArray(req.query.metric)) ? [req.query.metric] : req.query.metric;
  const from      = req.query.fromDateTime;
  const to        = req.query.toDateTime;
  let dbquery     = [];

  if (stats.length === 1 && stats[0] === undefined) {
    return res.status(400).json({
      heading: "stat parameter missing from querystring...",
      message: "?stat=<yourstathere>"
    });
  }

  let invalidstats = [];
  stats.forEach((stat) => {
    if (!_.includes(["min", "max", "average"], stat)) invalidstats.push(stat);
  });

  if (!_.isEmpty(invalidstats)) {
    return res.status(400).json({
      heading: "invalid stat...",
      message: invalidstats
    });
  }

  if (metrics.length === 1 && metrics[0] === undefined) {
    return res.status(400).json({
      heading: "metric parameter missing from querystring...",
      message: "?metric=<yourmetrichere>"
    });
  }

  if (!UTILS.moment.dateTime(from).isValid()) {
    return res.status(400).json({
      heading: "invalid fromDateTime format...",
      message: from
    });
  }

  if (!UTILS.moment.dateTime(to).isValid()) {
    return res.status(400).json({
      heading: "invalid toDateTime format...",
      message: to
    });
  }

  dbquery   = _.sortBy(store.measurements, "timestamp", 'asc');
  let alpha = _.findIndex(dbquery, { "timestamp": from });
  let omega = _.findIndex(dbquery, { "timestamp": to });
  dbquery   = _.slice(dbquery, alpha, omega);

  let metricscore = new Map();
  let metricerror = [];

  metrics.forEach((metric) => {
    store.measurements.forEach((measurement) => {
      if (measurement.hasOwnProperty(metric)) {
        metricscore.set(metric, 1);
      } else {
        metricscore.set(metric, 0);
      }
    });
  });

  metricscore.forEach((score, key) => {
    if (score === 0) {
      metrics.splice(metrics.indexOf(key), 1)
      metricerror.push(key);
    }
  });

  //  this should be 200
  if (!metrics || metrics.length === 0) {
    return res.status(400).json({
      heading: "invalid metric...",
      message: metricerror
    })
  }

  const statFunction = (stat, metric) => {
    let value;
    switch(stat) {
      case "min":
        value = _.minBy(dbquery, metric)[metric];
        break;
      case "max":
        value = _.maxBy(dbquery, metric)[metric];
        break;
      case "average":
        value = UTILS.array.averageBy(dbquery, metric);
        break;
    }
    return value;
  }

  let statistics = [];
  metrics.forEach((metric) => {
    let testobj = {};
    testobj["metric"] = metric;
    stats.forEach((stat) => testobj[stat] = statFunction(stat, metric));
    statistics.push(testobj);
  });

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