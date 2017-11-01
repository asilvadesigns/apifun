const MODEL     = require("../models");
const STORE     = require("../store");
const jsonpatch = require("fast-json-patch");

//
//  Generate Patch
//  Apply a JSON patch for a given timestamp with a request body.
//  Then validate the patched object against our schema.
//  Return any errors and the updated data.
const _generatePatch = (req, timestamp) => {

  let update = [];
  let errors;

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
