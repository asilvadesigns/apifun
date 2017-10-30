const CONTROLLERS = require("../controllers");
const measurements = require("express").Router();

measurements.get("/", CONTROLLERS.measurements.get);
measurements.get("/:timestamp", CONTROLLERS.measurements.getTimestamp);
measurements.post("/", CONTROLLERS.measurements.post);
measurements.put("/:timestamp", CONTROLLERS.measurements.putTimestamp);
measurements.patch("/:timestamp", CONTROLLERS.measurements.patchTimestamp);
measurements.delete("/:timestamp", CONTROLLERS.measurements.deleteTimestamp);

module.exports = measurements;
