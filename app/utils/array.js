const _ = require("lodash");

const _averageBy = (data, prop) => {
  let query = []
  data.forEach((item) => {
    if (item.hasOwnProperty(prop)) query.push(item[prop]);
  });
  return Math.round(_.mean(query) * 10) / 10;
}

module.exports = {
  averageBy: _averageBy
}