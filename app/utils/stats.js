const ARRAY = require("./array.js");
const _     = require("lodash");
const store = require("../store");

const _generateStat = (db, stat, metric) => {

  let value;

  switch(stat) {
    case "min":
      value = _.minBy(db, metric)[metric];
      break;
    case "max":
      value = _.maxBy(db, metric)[metric];
      break;
    case "average":
      value = ARRAY.averageBy(db, metric);
      break;
  }

  return value;

}

const _generateStatistics = (db, metrics, stats) => {

  let statistics = [];

  metrics.forEach((metric) => {

    let thisStat = {
      ["metric"]: metric
    };

    stats.forEach((stat) => {
      thisStat[stat] = _generateStat(db, metric, stat)
    });

    statistics.push(thisStat);
  });

  return statistics;

}

const _validateStats = (stats) => {

  let invalidstats = [];

  stats.forEach((stat) => {
    if (!_.includes(["min", "max", "average"], stat)) {
      invalidstats.push(stat)
    };
  });

  return invalidstats;
}

//
//  Validate Metrics
//
//  Essentially finds each requested metric in a db, determines
//  which is valid. Returns a new list of valid metrics and invalid.
//
//  In order to determine which metrics are valid, we perform a 
//  linear search through the store and compare against each metric
//  within the request. Valid metrics are assigned '1', invalid '0'.
//
//  Then we remove all invalid metrics from the metrics list. This 
//  modified metrics list is returned along with a list of invalid 
//  metrics for error reporting.
//
const _validateMetrics = (db, metrics) => {

  let metricscore = new Map();
  let metricerror = [];

  metrics.forEach((metric) => {
    db.forEach((measurement) => {
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

  return [metrics, metricerror];

}

module.exports = {
  generateStat: _generateStat,
  generateStats: _generateStatistics,
  validateStats: _validateStats,
  validateMetrics: _validateMetrics
}