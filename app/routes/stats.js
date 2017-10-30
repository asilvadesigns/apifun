const CONTROLLERS = require("../controllers");
const stats       = require("express").Router();

stats.get("/", CONTROLLERS.stats.get);

module.exports = stats;
