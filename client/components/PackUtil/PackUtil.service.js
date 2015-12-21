'use strict';

angular.module('weblistSavenub')
  .service('PackUtilService', ['PackSession', function (PackSession) {
    /**
     * Calculate the amount of time to display site per session. Weight is assumed to be in minutes
     */
    var calculateTimePerSite = function($scope) {
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
    };

    var grabToken = function(packId, prevSite, nextSite, callback) {
      var token = PackSession.redirectUrl({
        id: packId,
        prev: prevSite.id,
        next: nextSite.id
      }, function(){
        callback(token);
      });
    };

    return {
      calculateTimePerSite : calculateTimePerSite,
      grabToken            : grabToken
    }
  }]
);
