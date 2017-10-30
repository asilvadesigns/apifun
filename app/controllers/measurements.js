const _ = require("lodash");
const store = require("../store");

const _getAll = (req, res) => {
  if (_.isEmpty(store.measurements)) {
    return res.status(404).json({
      heading: "no measurements...",
      message: store.measurements
    });
  }
  res.status(200).json(store.measurements);
};

module.exports = {
  getAll: _getAll
};
