'use strict';

var app = require('../..');
var request = require('supertest');

var newPack;

describe('Pack API:', function() {

  describe('GET /api/packs', function() {
    var packs;

    beforeEach(function(done) {
      request(app)
        .get('/api/packs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          packs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      packs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/packs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/packs')
        .send({
          name: 'New Pack',
          info: 'This is the brand new pack!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newPack = res.body;
          done();
        });
    });

    it('should respond with the newly created pack', function() {
      newPack.name.should.equal('New Pack');
      newPack.info.should.equal('This is the brand new pack!!!');
    });

  });

  describe('GET /api/packs/:id', function() {
    var pack;

    beforeEach(function(done) {
      request(app)
        .get('/api/packs/' + newPack._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          pack = res.body;
          done();
        });
    });

    afterEach(function() {
      pack = {};
    });

    it('should respond with the requested pack', function() {
      pack.name.should.equal('New Pack');
      pack.info.should.equal('This is the brand new pack!!!');
    });

  });

  describe('PUT /api/packs/:id', function() {
    var updatedPack

    beforeEach(function(done) {
      request(app)
        .put('/api/packs/' + newPack._id)
        .send({
          name: 'Updated Pack',
          info: 'This is the updated pack!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPack = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPack = {};
    });

    it('should respond with the updated pack', function() {
      updatedPack.name.should.equal('Updated Pack');
      updatedPack.info.should.equal('This is the updated pack!!!');
    });

  });

  describe('DELETE /api/packs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/packs/' + newPack._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pack does not exist', function(done) {
      request(app)
        .delete('/api/packs/' + newPack._id)
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
