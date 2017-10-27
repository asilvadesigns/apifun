const stats     = require("express").Router();
const jsonpatch = require("fast-json-patch");
const moment    = require("moment");
const _         = require("lodash");

const model = require("../models/measurements.js");
const store = require("../store");

stats.get("/", (req, res) => {

  const stat      = req.query.stat;
  let metrics     = req.query.metric;
  const from      = req.query.fromDateTime;
  const to        = req.query.toDateTime;
  let dbquery     = [];

  if (!stat || stat.length === 0 ) {
    return res.status(400).json({
      heading: "stat parameter missing from querystring...",
      message: "?stat=<yourstathere>"
    })
  }

  if (!metrics || metrics.length === 0) {
    return res.status(400).json({
      heading: "metric parameter missing from querystring...",
      message: "?metric=<yourmetrichere>"
    });
  }

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

  if (!Array.isArray(metrics)) metrics = [metrics];
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

  const averageBy = (data, prop) => {
    let query = []
    data.forEach((item) => {
      if (item.hasOwnProperty(prop)) query.push(item[prop]);
    });
    return Math.round(_.mean(query) * 10) / 10;
  }

  let statistics = [];
  metrics.forEach((metric) => {
    statistics.push({
      "metric": metric,
      "min": _.minBy(dbquery, metric)[metric],
      "max": _.maxBy(dbquery, metric)[metric],
      "avg": averageBy(dbquery, metric),
    });
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
