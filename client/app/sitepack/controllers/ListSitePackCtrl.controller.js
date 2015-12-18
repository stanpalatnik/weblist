'use strict';

angular.module('weblistSavenub')
  .controller('ListSitePackCtrl', function ($scope, SitePack, PackUtilService, $stateParams) {
    $scope.sitepack = SitePack.get({
      id: $stateParams.packId
    }, function(){
      PackUtilService.calculateTimePerSite($scope);
    });
  });
