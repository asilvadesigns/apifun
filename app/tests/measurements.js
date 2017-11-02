process.env.NODE_ENV = 'test';

const STORE    = require("../store");
const UTILS    = require("../utils");
const APP      = require("../index");

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

chai.use(chaiHttp);

describe("Feature: Add a measurement", () => {

  //
  //  POST /measurements/
  describe("POST /measurements", () => {
    it("Add a measurement with valid (numeric) values", done => {
      let measurement = {
        "timestamp": "2015-09-01T16:00:00.000Z",
        "temperature": 27.1,
        "dewPoint": 16.7,
        "percipitation": 0
      }
      chai
        .request(APP)
        .post("/measurements")
        .send(measurement)
        .end((err, res) => {
          res.should.have.status(201);
          res.header['location'].should.equal(`/measurements/${measurement.timestamp}`);
          done();
        });
    });
  });

  //
  //  POST /measurements/
  describe("POST /measurements", () => {
    it("Cannot add a measurement with invalid values", done => {
      let measurement = {
        "timestamp": "2015-09-01T16:00:00.000Z",
        "temperature": "not a number",
        "dewPoint": 16.7,
        "percipitation": 0
      }
      chai
        .request(APP)
        .post("/measurements")
        .send(measurement)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  //
  //  POST /measurements/
  describe("POST /measurements", () => {
    it("Cannot add a measurement without a timestamp", done => {
      let measurement = {
        "temperature": 27.1,
        "dewPoint": 20,
        "percipitation": 0
      }
      chai
        .request(APP)
        .post("/measurements")
        .send(measurement)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});

describe("Feature: Get a measurement", () => {

  beforeEach(done => {
    STORE.measurements = [
      {
        "timestamp": "2015-09-01T16:00:00.000Z",
        "temperature": 27.1,
        "dewPoint": 16.7,
        "percipitation": 0
      },
      {
        "timestamp": "2015-09-01T16:10:00.000Z",
        "temperature": 27.3,
        "dewPoint": 16.9,
        "percipitation": 0
      },
      {
        "timestamp": "2015-09-01T16:20:00.000Z",
        "temperature": 27.5,
        "dewPoint": 17.1,
        "percipitation": 0
      },
      {
        "timestamp": "2015-09-01T16:30:00.000Z",
        "temperature": 27.4,
        "dewPoint": 17.3,
        "percipitation": 0
      },
      {
        "timestamp": "2015-09-01T16:40:00.000Z",
        "temperature": 27.2,
        "dewPoint": 17.2,
        "percipitation": 0
      },
      {
        "timestamp": "2015-09-02T16:00:00.000Z",
        "temperature": 28.1,
        "dewPoint": 18.3,
        "percipitation": 0
      },
    ];
    done();
  });

  //
  //  GET /measurements/
  describe("/GET /measurements/2015-09-01T16:20:00.000Z", () => {
    it("Get a specific measurement", done => {
      chai
        .request(APP)
        .get("/measurements/2015-09-01T16:20:00.000Z")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });
});