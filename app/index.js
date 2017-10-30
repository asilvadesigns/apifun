const CONFIG = require("./config");
const ROUTES = require("./routes");

const app = require("express")();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use('/', ROUTES);
app.use((err, req, res, next) => {
  console.log(res);
  console.log('this is a test');
  next(err);
});

app.listen(CONFIG.PORT, () => {
  console.log("Server listenting on port " + CONFIG.PORT + " ...");
});
