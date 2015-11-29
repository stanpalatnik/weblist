'use strict';

describe('Controller: SitepackCtrl', function () {

  // load the controller's module
  beforeEach(module('weblistApp'));

  var SitepackCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SitepackCtrl = $controller('SitepackCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
