const CONFIG = require("./config");
const ROUTES = require("./routes");

const app = require("express")();
const bodyParser = require("body-parser");
const helmet = require("helmet");

app.use(bodyParser.json());
app.use(helmet());
app.use("/", ROUTES);

app.listen(CONFIG.port, CONFIG.host, () => {
  console.log("Server listenting on port " + CONFIG.port + " ...");
});
