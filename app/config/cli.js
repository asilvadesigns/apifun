const _ = require("lodash");

let _host;
let _port;

const hostIndex = _.indexOf(process.argv, "--host");
const portIndex = _.indexOf(process.argv, "--port");

if (hostIndex !== -1) _host = process.argv[hostIndex + 1];
if (portIndex !== -1) _port = process.argv[portIndex + 1];

module.exports = {
  host: _host,
  port: _port
}