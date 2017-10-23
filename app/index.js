const CONFIG = require("./config");
const ROUTES = require("./routes");

const app = require("express")();

app.use('/', ROUTES);

app.listen(CONFIG.PORT, () => {
  console.log("Server listenting on port " + CONFIG.PORT + " ...");
});
