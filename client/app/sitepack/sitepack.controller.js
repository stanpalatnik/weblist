'use strict';

angular.module('weblistSavenub')
  .controller('SitepackCtrl', function ($scope, SitePack) {
    $scope.sitepacks = SitePack.get({
      id: 1
    })
  });
