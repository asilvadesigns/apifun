const _message = require("./message");
const _measurements = require("./measurements");
const _moment = require("./moment");
const _array = require("./array");
const _stats = require("./stats");

module.exports = {
  array: _array,
  generalMessage: _message.generalMessage,
  measurements: _measurements,
  moment: _moment,
  stats: _stats
}
