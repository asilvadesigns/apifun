const CONFIG = require("./config");
const ROUTES = require("./routes");

const app = require("express")();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use('/', ROUTES);

app.listen(CONFIG.PORT, () => {
  console.log("Server listenting on port " + CONFIG.PORT + " ...");
});
