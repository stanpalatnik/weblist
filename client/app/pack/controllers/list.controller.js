'use strict';

angular.module('weblistSavenub')
  .controller('ListPackCtrl', function ($scope, Pack) {
    console.log('list pack ctrl');
    $scope.packList = Pack.query();
  });
