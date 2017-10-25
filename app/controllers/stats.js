const stats = require("express").Router();
const jsonpatch = require("fast-json-patch");
const moment = require("moment");

const model = require("../models/measurements.js");
const store = require("../store");

stats.get("/", (req, res) => {
  res.status(200).json({
    heading: "querystring test...",
    message: req.query
  })
});

module.exports = stats;

