'use strict';

describe('Controller: PacksessionCtrl', function () {

  // load the controller's module
  beforeEach(module('weblistApp'));

  var PacksessionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PacksessionCtrl = $controller('PacksessionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
