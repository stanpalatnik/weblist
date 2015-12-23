'use strict';

describe('Service: SiteNavigatorService', function () {

  // load the service's module
  beforeEach(module('weblistApp'));

  // instantiate service
  var SiteNavigatorService;
  beforeEach(inject(function (_SiteNavigatorService_) {
    SiteNavigatorService = _SiteNavigatorService_;
  }));

  it('should do something', function () {
    expect(!!SiteNavigatorService).toBe(true);
  });

});
