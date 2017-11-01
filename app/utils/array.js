const _ = require("lodash");

//  Average By
//  Wrapper around lodash's mean. Returns an average from a query such that
//  the query is the result of filtering data containing a specific property.
const _averageBy = (data, prop) => {
  let query = _.map(data, obj => obj.hasOwnProperty(prop) ? obj[prop] : null);
  return Math.round(_.mean(query) * 10) / 10;
}

module.exports = {
  averageBy: _averageBy
}