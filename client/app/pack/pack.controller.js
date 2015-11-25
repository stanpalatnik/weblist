'use strict';

angular.module('weblistSavenub')
  .controller('PackCtrl', function ($scope) {
    $scope.numbersOnly = /^\d+$/;
    $scope.message = 'Hello';
  });
