'use strict';

angular.module('weblistSavenub')
  .controller('ShowPackCtrl', function ($scope, Pack, $stateParams) {
    console.log('show pack ctrl');
    $scope.pack = Pack.get({id: $stateParams.packId});
  });
