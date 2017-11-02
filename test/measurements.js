process.env.NODE_ENV = 'test';

const STORE    = require("../app/store");
const APP      = require("../app");

const chai     = require('chai');
const chaiHttp = require('chai-http');
const should   = chai.should();

chai.use(chaiHttp);

describe("Books", () => {

  //  need util to clear DB before each test.
  // beforeEach(done => {
  //   //Before each test we empty the database
  //   Book.remove({}, err => {
  //     done();
  //   });
  // });

  //
  //  GET /measurements/
  //  Should GET all measurements from data store
  describe("/GET measurements", () => {
    it("it should GET all the measurements", done => {
      chai
        .request(APP)
        .get("/measurements")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

});