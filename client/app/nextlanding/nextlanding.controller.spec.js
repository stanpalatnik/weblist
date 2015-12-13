'use strict';

describe('Controller: NextlandingCtrl', function () {

  // load the controller's module
  beforeEach(module('weblistSavenub'));

  var NextlandingCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NextlandingCtrl = $controller('NextlandingCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
