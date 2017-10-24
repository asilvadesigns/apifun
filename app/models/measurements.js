const AJV = require("ajv");
const ajv = new AJV({ allErrors: true });

const schema = {
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "temperature": { "type": "number" },
    "dewpoint": { "type": "number" },
    "percipitation": { "type": "number" }
  },
  "required": ["timestamp"]
}

const isValid = (data) => {
  return {
     valid: ajv.validate(schema, data),
     errors: ajv.errors
  }
}

module.exports.isValid = isValid;
