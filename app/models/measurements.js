const schema = {
  "properties": {
    "timestamp": { "type": "string" },
    "temperature": { "type": "number" },
    "dewpoint": { "type": "number" },
    "percipitation": { "type": "number" }
  },
  "required": ["timestamp"]
}

module.exports = schema;
