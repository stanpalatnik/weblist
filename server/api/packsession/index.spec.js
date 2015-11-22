'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var packsessionCtrlStub = {
  index: 'packsessionCtrl.index',
  show: 'packsessionCtrl.show',
  create: 'packsessionCtrl.create',
  update: 'packsessionCtrl.update',
  destroy: 'packsessionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var packsessionIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './packsession.controller': packsessionCtrlStub
});

describe('Packsession API Router:', function() {

  it('should return an express router instance', function() {
    packsessionIndex.should.equal(routerStub);
  });

  describe('GET /api/packsessions', function() {

    it('should route to packsession.controller.index', function() {
      routerStub.get
        .withArgs('/', 'packsessionCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/packsessions/:id', function() {

    it('should route to packsession.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'packsessionCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/packsessions', function() {

    it('should route to packsession.controller.create', function() {
      routerStub.post
        .withArgs('/', 'packsessionCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/packsessions/:id', function() {

    it('should route to packsession.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'packsessionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/packsessions/:id', function() {

    it('should route to packsession.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'packsessionCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/packsessions/:id', function() {

    it('should route to packsession.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'packsessionCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
