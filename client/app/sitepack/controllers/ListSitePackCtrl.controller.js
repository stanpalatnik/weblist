'use strict';

angular.module('weblistSavenub')
  .controller('ListSitePackCtrl', function ($scope, SitePack, $stateParams) {
    $scope.sitepack = SitePack.get({
      id: $stateParams.packId
    }, function(){
      calculateTimePerSite();
    });

    /**
     * Calculate the amount of time to display site per session. Weight is assumed to be in minutes
     */
    var calculateTimePerSite = function() {
      var allocated = $scope.sitepack.time;
      var totalWeight;
      if($scope.sitepack.Sites.length > 1 ) {
        totalWeight = $scope.sitepack.Sites.reduce( function(prevSite, nextSite) {
          return {
            SitePack: {
              weight: prevSite.SitePack.weight + nextSite.SitePack.weight
            }
          }
        }).SitePack.weight;
      }
      else {
        totalWeight = $scope.sitepack.Sites[0].SitePack.weight;
      }

      var timePerWeight = allocated / totalWeight;
      $scope.sitepack.Sites =  $scope.sitepack.Sites.map(function(site) {
        site.allocatedTime = Number(Math.round((site.SitePack.weight * timePerWeight+'e2'))+'e-2');
        return site;
      });
    }
  });
