'use strict';

describe('Directive: siteframe', function () {

  // load the directive's module and view
  beforeEach(module('weblistSavenub'));
  beforeEach(module('app/siteframe/siteframe.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<siteframe></siteframe>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the siteframe directive');
  }));
});
