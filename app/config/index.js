const FLAGS = require("./cli");

const _port = FLAGS.port || process.env.PORT || 3000;
const _host = FLAGS.host || process.env.HOST || "localhost";

module.exports = {
  host: _host,
  port: _port
}