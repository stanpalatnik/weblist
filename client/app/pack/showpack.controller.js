'use strict';

angular.module('weblistSavenub')
  .controller('ShowPackCtrl', function ($scope, Pack) {
    $scope.packId = 0;
    $scope.pack = Pack.get({id: packId});
  });
