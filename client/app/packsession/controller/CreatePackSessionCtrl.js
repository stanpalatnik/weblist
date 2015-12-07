'use strict';

angular.module('weblistSavenub')
  .controller('CreatePackSessionCtrl', function ($scope, $q, Pack, SitePack, PackSession, PackSessionService, $stateParams, $state) {

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
      calculateTimePerSite();
      PackSessionService.startSession($scope.pack.id, $scope.sitepack.Sites, $scope.sitepack.time);
    });

    /**
     * Calculate the amount of time to display site per session. Weight is assumed to be in minutes
     */
    var calculateTimePerSite = function() {
      var allocated = $scope.sitepack.time;
      var totalWeight;
      if($scope.sitepack.Sites.length > 1 ) {
        totalWeight = $scope.sitepack.Sites.reduce( (prevSite, nextSite) => prevSite.SitePack.weight + nextSite.SitePack.weight);
      }
      else {
        totalWeight = $scope.sitepack.Sites[0].SitePack.weight;
      }
      var timePerWeight = allocated / totalWeight;
      $scope.sitepack.Sites =  $scope.sitepack.Sites.map(function(site) {
        site.allocatedTime = site.SitePack.weight * timePerWeight;
        return site;
      });
    }
  });
