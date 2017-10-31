const UTILS      = require("../utils");
const _          = require("lodash");
const jsonpatch  = require("fast-json-patch");
const store      = require("../store");

const _get = (req, res) => {

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

  let statErrors = UTILS.stats.validateStats(stats);
  if (!_.isEmpty(statErrors)) {
    return res.status(400).json({
      heading: "invalid stat...",
      message: statErrors 
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

  let [validmetrics, invalidmetrics] = UTILS.stats.validateMetrics(dbquery, metrics);
  if (_.isEmpty(validmetrics)) {
    return res.status(400).json({     // should be 200
      heading: "invalid metric...",
      message: invalidmetrics
    })
  }

  let statistics = UTILS.stats.generateStats(dbquery, validmetrics, stats);
  res.status(200).json({
    heading: "querystring test...",
    message: {
      querystring: req.query,
      queryresult: dbquery,
      statistics: statistics
    }
  });

}

module.exports = {
  get: _get
};