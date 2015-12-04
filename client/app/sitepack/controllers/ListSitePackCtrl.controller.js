'use strict';

angular.module('weblistSavenub')
  .controller('ListSitePackCtrl', function ($scope, SitePack, $stateParams) {
    $scope.sitepacks = SitePack.get({
      id: $stateParams.packId
    }, function(){
      calculateTimePerSite();
    });

    /**
     * Calculate the amount of time to display site per session. Weight is assumed to be in minutes
     */
    var calculateTimePerSite = function() {
      var allocated = $scope.sitepacks.time;
      var totalWeight = $scope.sitepacks.Sites.reduce( (prevSite, nextSite) => prevSite.weight + nextSite.weight);
      var timePerWeight = allocated / totalWeight;
      $scope.sitepacks.Sites =  $scope.sitepacks.Sites.map(function(site) {
        site.allocatedTime = site.weight * timePerWeight;
        return site;
      });
    }
  });
