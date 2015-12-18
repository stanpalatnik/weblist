'use strict';

angular.module('weblistSavenub')
  .controller('CreatePackSessionCtrl', function ($scope, $q, Pack, SitePack, PackSession, PackSessionService, PackUtilService, $stateParams, $state) {

    function getPack() {
      var d = $q.defer();
      var result = Pack.get({id: $stateParams.packId}, function() {
        d.resolve(result);
      });
      return d.promise;
    }

    function getSitePack() {
      var d = $q.defer();
      var result = SitePack.get({
        id: $stateParams.packId
      }, function() {
        d.resolve(result);
      });
      return d.promise;
    }

    $q.all([
      getPack(),
      getSitePack()
    ]).then(function(data) {
      $scope.pack = data[0];
      $scope.sitepack = data[1];
      PackUtilService.calculateTimePerSite($scope);
      PackSessionService.startSession($scope.pack, $scope.sitepack.Sites, $scope.sitepack.time);
    });
  });
