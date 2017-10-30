const AJV = require("ajv");
const ajv = new AJV({ allErrors: true });

const _schema = {
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "temperature": { "type": "number" },
    "dewPoint": { "type": "number" },
    "percipitation": { "type": "number" }
  },
  "required": ["timestamp"]
}

const _isValid = (data) => {
  return {
     valid: ajv.validate(_schema, data),
     errors: ajv.errors
  }
}

module.exports = {
  schema: _schema,
  isValid: _isValid
}