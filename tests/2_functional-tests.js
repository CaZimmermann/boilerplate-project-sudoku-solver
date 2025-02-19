const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({ puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'solution');
            done();
          });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: 'Required field missing' });
            done();
          });
    });  

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({
            puzzle: 'a.839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
            done();
          });
    });
    
    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({
            puzzle: '...839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
            done();
          });
    }); 

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai.request(server)
          .post('/api/solve')
          .send({
            puzzle: '..9.7...5..21..9..1...28....7...5..1..851.....5....3.......3..68........21.....87'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
            done();
          });
    }); 

    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
            coordinate: 'A3',
            value: 7,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {valid: true});
            done();
          });
    });
    
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
            coordinate: 'B3',
            value: 3,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                valid: false,
                conflict: ['column']});
            done();
          });
    });

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        chai.request(server)
          .post('/api/check')
          .send({
            puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
            coordinate: 'A3',
            value: 2,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, {
                valid: false,
                conflict: ['row', 'region']});
                done();
    });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        coordinate: 'A4',
        value: 8,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            valid: false,
            conflict: ['row', 'column', 'region']});
        done();
      });
    });

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
          coordinate: 'A4',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field(s) missing' });
          done();
        });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '82C.4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
          coordinate: 'A4',
          value: 8,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '82...4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
          coordinate: 'A4',
          value: 8,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
          coordinate: 'AA',
          value: 8,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid coordinate' });
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
          coordinate: 'A4',
          value: "a",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid value' });
          done();
        });
    });

});

