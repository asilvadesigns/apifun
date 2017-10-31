const MODEL     = require("../models");
const STORE     = require("../store");
const jsonpatch = require("fast-json-patch");

const _generatePatch = (req, timestamp) => {

  let errors;
  let update = [];

  update = STORE.measurements.map((measurement) => {

    if (measurement.timestamp === timestamp) {
      let patcheditem = jsonpatch.applyPatch(measurement, req.body, true).newDocument;
      let schema = MODEL.measurements.isValid(patcheditem);
      return (!schema.valid) ? errors = schema.errors : patcheditem;
    }

    return measurement;
  });

  return [errors, update];
}

module.exports = {
  generatePatch: _generatePatch
}
