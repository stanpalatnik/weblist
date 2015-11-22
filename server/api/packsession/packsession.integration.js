'use strict';

var app = require('../..');
var request = require('supertest');

var newPacksession;

describe('Packsession API:', function() {

  describe('GET /api/packsessions', function() {
    var packsessions;

    beforeEach(function(done) {
      request(app)
        .get('/api/packsessions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          packsessions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      packsessions.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/packsessions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/packsessions')
        .send({
          name: 'New Packsession',
          info: 'This is the brand new packsession!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newPacksession = res.body;
          done();
        });
    });

    it('should respond with the newly created packsession', function() {
      newPacksession.name.should.equal('New Packsession');
      newPacksession.info.should.equal('This is the brand new packsession!!!');
    });

  });

  describe('GET /api/packsessions/:id', function() {
    var packsession;

    beforeEach(function(done) {
      request(app)
        .get('/api/packsessions/' + newPacksession._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          packsession = res.body;
          done();
        });
    });

    afterEach(function() {
      packsession = {};
    });

    it('should respond with the requested packsession', function() {
      packsession.name.should.equal('New Packsession');
      packsession.info.should.equal('This is the brand new packsession!!!');
    });

  });

  describe('PUT /api/packsessions/:id', function() {
    var updatedPacksession

    beforeEach(function(done) {
      request(app)
        .put('/api/packsessions/' + newPacksession._id)
        .send({
          name: 'Updated Packsession',
          info: 'This is the updated packsession!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPacksession = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPacksession = {};
    });

    it('should respond with the updated packsession', function() {
      updatedPacksession.name.should.equal('Updated Packsession');
      updatedPacksession.info.should.equal('This is the updated packsession!!!');
    });

  });

  describe('DELETE /api/packsessions/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/packsessions/' + newPacksession._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when packsession does not exist', function(done) {
      request(app)
        .delete('/api/packsessions/' + newPacksession._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
