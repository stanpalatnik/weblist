'use strict';

angular.module('weblistSavenub')
  .controller('ListPackCtrl', function ($scope, Pack) {
    $scope.packList = Pack.query();
  });
