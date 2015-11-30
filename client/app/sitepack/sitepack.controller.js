'use strict';

angular.module('weblistSavenub')
  .controller('SitepackCtrl', function ($scope, SitePack, $stateParams) {
    $scope.sitepacks = SitePack.get({
      id: $stateParams.packId
    })
  });
