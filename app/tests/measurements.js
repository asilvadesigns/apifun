process.env.NODE_ENV = 'test';

const STORE    = require("../store");
const UTILS    = require("../utils");
const APP      = require("../index");

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

chai.use(chaiHttp);

describe("Feature: Add a measurement", () => {

  beforeEach(done => {
    STORE.measurements = [];
    done();
  });

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
  describe("GET /measurements/2015-09-01T16:20:00.000Z", () => {
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

  //
  //  GET /measurements/
  describe("GET /measurements/2015-09-01T16:50:00.000Z", () => {
    it("Get a measurement that does not exist", done => {
      chai
        .request(APP)
        .get("/measurements/2015-09-01T16:50:00.000Z")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  //
  //  GET /measurements/
  describe("GET /measurements/2015-09-01", () => {
    it("Get measurements from a day", done => {
      chai
        .request(APP)
        .get("/measurements/2015-09-01")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  //
  //  GET /measurements/
  describe("GET /measurements/2015-09-03", () => {
    it("Get measurement from a day where no measurements were taken.", done => {
      chai
        .request(APP)
        .get("/measurements/2015-09-03")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

});

describe("Feature: Update a measurement(PUT)", () => {

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
    ];
    done();
  });

  //
  //  PUT /measurements/
  describe("PUT /measurements", () => {
    it("Replace a measurement with valid (numeric) values", done => {
      let measurement = {
        "timestamp": "2015-09-01T16:00:00.000Z",
        "temperature": 27.1,
        "dewPoint": 16.7,
        "percipitation": 15.2 
      }
      chai
        .request(APP)
        .put("/measurements/" + measurement.timestamp)
        .send(measurement)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  //
  //  PUT /measurements/
  describe("PUT /measurements", () => {
    it("Replace a measurement with invalid values", done => {
      let measurement = {
        "timestamp": "2015-09-01T16:00:00.000Z",
        "temperature": "not a number",
        "dewPoint": 16.7,
        "percipitation": 0
      }
      chai
        .request(APP)
        .put(`/measurements/${measurement.timestamp}`)
        .send(measurement)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  //
  //  PUT /measurements/
  describe("PUT /measurements", () => {
    it("Replace a measurement with mismatched timestamps", done => {
      let conflictid = "2015-09-01T16:00:00.000Z";
      let measurement = {
        "timestamp": "2015-09-02T16:00:00.000Z",
        "temperature": 27.1,
        "dewPoint": 16.7,
        "percipitation": 0
      }
      chai
        .request(APP)
        .put(`/measurements/${conflictid}`)
        .send(measurement)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });
  });

  //
  //  PUT /measurements/
  describe("PUT /measurements", () => {
    it("Replace a measurement that does not exist", done => {
      let nonexistant = "2015-09-02T16:00:00.000Z";
      let measurement = {
        "timestamp": "2015-09-02T16:00:00.000Z",
        "temperature": 27.1,
        "dewPoint": 16.7,
        "percipitation": 0
      }
      chai
        .request(APP)
        .put(`/measurements/${nonexistant}`)
        .send(measurement)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});

describe("Feature: Update a measurement(PATCH)", () => {

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
    ];
    done();
  });

  //
  //  PATCH /measurements/
  describe("PATCH /measurements", () => {
    it("Update metrics of a measurement with valid (numeric) values", done => {
      let timestamp = "2015-09-01T16:00:00.000Z";
      let operation = [ 
        {
          "op": "replace",
          "path": "/percipitation",
          "value": 12.3
        }
      ];
      chai
        .request(APP)
        .patch(`/measurements/${timestamp}`)
        .send(operation)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  //
  //  PATCH /measurements/
  describe("PATCH /measurements", () => {
    it("Update metrics of a measurement with invalid values", done => {
      let timestamp = "2015-09-01T16:00:00.000Z";
      let operation = [ 
        {
          "op": "replace",
          "path": "/percipitation",
          "value": "not a number"
        }
      ];
      chai
        .request(APP)
        .patch(`/measurements/${timestamp}`)
        .send(operation)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  //
  //  PATCH /measurements/
  // describe("PATCH /measurements", () => {
  //   it("Update metrics of a measurement with mismatched timestamps", done => {
  //     let timestamp = "2015-09-01T16:00:00.000Z";
  //     let operation = [ 
  //       {
  //         "op": "replace",
  //         "path": "/percipitation",
  //         "value": "not a number"
  //       }
  //     ];
  //     chai
  //       .request(APP)
  //       .patch(`/measurements/${timestamp}`)
  //       .send(operation)
  //       .end((err, res) => {
  //         res.should.have.status(400);
  //         done();
  //       });
  //   });
  // });

  //
  //  PATCH /measurements/
  describe("PATCH /measurements", () => {
    it("Update metrics of a measurement that does not exist", done => {
      let timestamp = "2015-09-02T16:00:00.000Z";
      let operation = [ 
        {
          "op": "replace",
          "path": "/percipitation",
          "value": 12.3
        }
      ];
      chai
        .request(APP)
        .patch(`/measurements/${timestamp}`)
        .send(operation)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});