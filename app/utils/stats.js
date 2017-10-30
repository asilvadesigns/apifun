const ARRAY = require("./array.js");

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

module.exports = {
  generateStat: _generateStat
}
