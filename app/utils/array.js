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
// const _ = require("lodash");

// //  Wrapper around lodash's mean... for unknown reasons '_.meanBy' would
// //  not return the correct mean value, additionally in this manner I have
// //  more control which is nice.
// const _averageBy = (data, prop) => {
//   let query = _.map(data, obj => obj.hasOwnProperty(prop));
//   return Math.round(_.mean(query) * 10) / 10;
// }

// module.exports = {
//   averageBy: _averageBy
// }