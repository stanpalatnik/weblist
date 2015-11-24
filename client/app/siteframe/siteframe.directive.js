'use strict';

angular.module('weblistApp')
  .directive('siteframe', function () {
    return {
      templateUrl: 'app/siteframe/siteframe.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
