const CONFIG = require("./config");
const ROUTES = require("./routes");

const app = require("express")();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const validator = require("express-validator");

app.use(bodyParser.json());
app.use(helmet());
app.use(validator());
app.use("/", ROUTES);

app.listen(CONFIG.port, CONFIG.host, () => {
  console.log(`Server listenting at ${CONFIG.host}:${CONFIG.port}`);
});