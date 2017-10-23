const CONFIG = require("./config");
const DATA = require("./data/measurements.json");

const fs = require("fs");
const _ = require("lodash");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "hello world!" });
});

//  Get measurements
app.get("/measurements", (req, res) => {
  res.json(DATA);
});

//  GET measurement by timestamp
app.get("/measurements/:timestamp", (req, res) => {
  let QUERY = DATA.measurements.filter(measurement => {
    var DATA_ID = measurement.timestamp;
    var REQUEST = req.params.timestamp;
    if (DATA_ID === REQUEST || DATA_ID.includes(REQUEST)) {
      return measurement;
    }
  });

  if (QUERY.length === 0) {
    return res.status(404).end();
  }

  res.type("application/json");
  res.status(200).json(QUERY);
});

//  POST measurements
app.post("/measurements", (req, res) => {
  DATA.measurements.push(req.body);

  fs.writeFile("./data/measurements.json", JSON.stringify(DATA, null, 2), err => {
    if (err) console.log(err);
  });

  res.type("application/json");
  res.location(req.url + req.body.timestamp);
  res.status(201).end();
});

//  PUT measurements by timestamp
app.put("/measurements/:timestamp", (req, res) => {
  let UPDATE = DATA.measurements.map(measurement => {
    var DATA_ID = measurement.timestamp;
    var REQUEST = req.params.timestamp;
    return DATA_ID === REQUEST ? req.body : measurement;
  });

  DATA.measurements = UPDATE;
  fs.writeFile("./data/measurements.json", JSON.stringify(DATA, null, 2), err => {
    if (err) console.log(err);
  });

  res.status(204).end();
});

//  DELETE measurement by timestamp
app.delete("/measurements/:timestamp", (req, res) => {
  let UPDATE = DATA.measurements.filter(measurement => {
    var DATA_ID = measurement.timestamp;
    var REQUEST = req.params.timestamp;
    if (DATA_ID !== REQUEST) {
      return measurement;
    }
  });

  DATA.measurements = UPDATE;
  fs.writeFile("./data/measurements.json", JSON.stringify(DATA, null, 2), err => {
    if (err) console.log(err);
  });

  res.status(204).end();
});

////  PATCH measurements by timestamp
//app.patch("/measurements/:timestamp", (req, res) => {
//  DATA.measurements.forEach(measurement => {
//    var DATA_ID = measurement.timestamp;
//    var REQUEST = req.params.timestamp;
//    if (DATA_ID === REQUEST) {
//      // console.log('update this one:', measurement);
//      // console.log('  with this one:', req.body);
//      console.log(Object.keys(req.body));
//    }
//  });
//
//  res.type("application/json");
//  res.status(204).end();
//});

app.listen(CONFIG.PORT, _ => {
  console.log("Server listenting on port " + CONFIG.PORT + " ...");
});