const STORE      = require("../store");
const UTILS      = require("../utils");
const _          = require("lodash");
const jsonpatch  = require("fast-json-patch");

//
//  GET /stats/
//  Get requested stats and metrics within daterange from data store
const _get = (req, res) => {

  const stats     = (!Array.isArray(req.query.stat)) ? [req.query.stat] : req.query.stat;
  const metrics   = (!Array.isArray(req.query.metric)) ? [req.query.metric] : req.query.metric;
  const from      = req.query.fromDateTime;
  const to        = req.query.toDateTime;
  let dbquery     = [];

  //  GET request stats must be defined
  if (stats.length === 1 && stats[0] === undefined) {
    return res.status(400).json({
      heading: "stat parameter missing from querystring...",
      message: "?stat=<yourstathere>"
    });
  }

  //  GET request stats must be valid
  let statErrors = UTILS.stats.validateStats(stats);
  if (!_.isEmpty(statErrors)) {
    return res.status(400).json({
      heading: "invalid stat...",
      message: statErrors 
    });
  }

  //  GET request metrics must be defined
  if (metrics.length === 1 && metrics[0] === undefined) {
    return res.status(400).json({
      heading: "metric parameter missing from querystring...",
      message: "?metric=<yourmetrichere>"
    });
  }

  //  GET request 'from' date must be valid datetime
  if (!UTILS.moment.dateTime(from).isValid()) {
    return res.status(400).json({
      heading: "invalid fromDateTime format...",
      message: from
    });
  }

  //  GET request 'to' date must be valid datetime
  if (!UTILS.moment.dateTime(to).isValid()) {
    return res.status(400).json({
      heading: "invalid toDateTime format...",
      message: to
    });
  }

  //  GET build sorted 'query' within 'from' and 'to' range
  query     = _.sortBy(STORE.measurements, "timestamp", 'asc');
  let alpha = _.findIndex(query, { "timestamp": from });
  let omega = _.findIndex(query, { "timestamp": to });
  query     = _.slice(query, alpha, omega);

  //  GET metrics must be valid
  let [validmetrics, invalidmetrics] = UTILS.stats.validateMetrics(query, metrics);
  if (_.isEmpty(validmetrics)) {
    return res.status(400).json({     // should be 200
      heading: "invalid metric...",
      message: invalidmetrics
    });
  }

  //  GET build 'statistics' from 'query', given 'validmetrics' and 'stats'
  let statistics = UTILS.stats.generateStats(query, validmetrics, stats);
  res.status(200).json({
    heading: "querystring test...",
    message: {
      querystring: req.query,
      queryresult: query,
      statistics: statistics
    }
  });

}

module.exports = {
  get: _get
};