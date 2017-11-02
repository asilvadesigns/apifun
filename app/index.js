const CONFIG = require("./config");
const ROUTES = require("./routes");

const express    = require("express");
const bodyParser = require("body-parser");
const helmet     = require("helmet");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use("/", ROUTES);

app.listen(CONFIG.port, CONFIG.host, () => {
  console.log(`Server listenting at ${CONFIG.host}:${CONFIG.port}`);
});

module.exports = app;