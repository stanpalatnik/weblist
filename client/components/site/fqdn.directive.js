'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('weblistSavenub')
  .directive('validDomain', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('change', function() {
          if(!validator.isFQDN(element.val())) {
            return ngModel.$setValidity('fqdn', false);
          }
        });
        element.on('keydown', function() {
          return ngModel.$setValidity('fqdn', true);
        });
      }
    };
  });
