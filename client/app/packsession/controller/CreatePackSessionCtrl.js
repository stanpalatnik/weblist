'use strict';

angular.module('weblistSavenub')
  .controller('CreatePackSessionCtrl', function ($scope, PackSession, $stateParams, $state) {
    $scope.pack = Pack.get({id: $stateParams.packId});
    $scope.sitepack = SitePack.get({
      id: $stateParams.packId
    }, function () {
      calculateTimePerSite();
    });

    /**
     * Calculate the amount of time to display site per session. Weight is assumed to be in minutes
     */
    var calculateTimePerSite = function () {
      var allocated = $scope.sitepack.time;
      var totalWeight = $scope.sitepack.Sites.reduce((prevSite, nextSite) => prevSite.SitePack.weight + nextSite.SitePack.weight);
      var timePerWeight = allocated / totalWeight;
      $scope.sitepack.Sites = $scope.sitepack.Sites.map(function (site) {
        site.allocatedTime = site.SitePack.weight * timePerWeight;
        return site;
      });
    }
  });
