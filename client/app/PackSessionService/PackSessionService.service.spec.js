'use strict';

describe('Service: PackSessionService', function () {

  // load the service's module
  beforeEach(module('weblistApp'));

  // instantiate service
  var PackSessionService;
  beforeEach(inject(function (_PackSessionService_) {
    PackSessionService = _PackSessionService_;
  }));

  it('should do something', function () {
    expect(!!PackSessionService).toBe(true);
  });

});
