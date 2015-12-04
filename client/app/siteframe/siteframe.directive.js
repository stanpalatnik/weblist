'use strict';

angular.module('weblistSavenub')
  .directive('siteframe', function () {
    return {
      templateUrl: 'app/siteframe/siteframe.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });
