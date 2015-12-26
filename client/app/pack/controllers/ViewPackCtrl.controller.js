'use strict';

angular.module('weblistSavenub')
  .controller('ViewPackCtrl', function ($scope, Pack, $stateParams, $state) {
    if($stateParams.packId.length == 0 || isNaN($stateParams.packId)) {
      $state.go('pack.list');
    }
    else {
      $scope.pack = Pack.get({id: $stateParams.packId});
      $scope.geoPattern = GeoPattern.generate($scope.pack.id).toDataUrl();
    }
  });
