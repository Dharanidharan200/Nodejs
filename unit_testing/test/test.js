// // test/test.js

// const assert = require('assert');

// describe('Basic Math', function () {
//   it('should return 2 when adding 1 and 1', function () {
//     assert.strictEqual(1 + 1, 2);
//   });

//   it('should return -1 when subtracting 1 from 0', function () {
//     assert.strictEqual(0 - 1, -1);
//   });
// });
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../test/index'); // Import your Express app

// const should = chai.should();
// chai.use(chaiHttp);

// describe('Users API', function () {
//   // Test the GET /users endpoint
//   describe('GET /users', function () {
//     it('should get a list of users', function (done) {
//       chai.request(server)
//         .get('/users')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.an('array');
//           res.body.should.have.length.above(0);
//           done();
//         });
//     });
//   });
  
//   // Add more test cases as needed
// });

// // Close the server after all tests are done
// after(function (done) {
//   server.close(done);
// });
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../test/index'); // Import your Express app

// const should = chai.should();
// chai.use(chaiHttp);

// describe('Users API', function () {
//   // Test the GET /users endpoint
//   describe('GET /users', function () {
//     it('should get a list of users', function (done) {
//       chai.request(server)
//         .get('/users')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.an('array');
//           res.body.should.have.length.above(0);
//           done();
//         });
//     });
//   });

  // Add more test cases as needed

  // // Close the server after all tests are done
  // after(function (done) {
  //   // Check if the server is running before trying to close it
  //   if (server && server.close) {
  //     server.close(done);
  //   } else {
  //     done();
  //   }
  // });
// });
//npm install commands
//npm init -y,npm install --save -dev mocha,mkdir test,
//npm install --save -dev chai,npm install --save-dev chai-http,
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../test/index'); // Import your Express app

const should = chai.should();
chai.use(chaiHttp);

describe('User API', function () {
  // Test the POST /users endpoint
  describe('POST /users', function () {
    it('should create a new user', function (done) {
      const newUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      chai.request(server)
        .post('/users')
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(201); // Assuming 201 for successful creation
          res.body.should.be.an('object');
          res.body.should.have.property('id');
          res.body.should.have.property('name').eql(newUser.name);
          res.body.should.have.property('email').eql(newUser.email);
          done();
        });
    });
  });

  // Add more test cases as needed
});

// // Close the server after all tests are done
// after(function (done) {
//   if (server && server.close) {
//     server.close(done);
//   } else {
//     done();
//   }
// });


