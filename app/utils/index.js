const MESSAGE = require("./message");
const MEASUREMENTS = require("./measurements");
const MOMENT = require("./moment");
const ARRAY = require("./array");
const STATS = require("./stats");

module.exports = {
  array: ARRAY,
  generalMessage: MESSAGE.generalMessage,
  measurements: MEASUREMENTS,
  moment: MOMENT,
  stats: STATS
}
