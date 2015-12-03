'use strict';

angular.module('weblistSavenub')
  .controller('ListSitePackCtrl', function ($scope, SitePack, $stateParams) {
    $scope.sitepacks = SitePack.get({
      id: $stateParams.packId
    });
    calculateTimePerSite($scope.sitepacks);


    var calculateTimePerSite = function(sitepacks) {
      var allocated = sitepacks.time;
      var totalWeight = sitepacks.Sites.reduce( (prevSite, nextSite) => prevSite.weight + nextSite.weight);
      var timePerWeight = allocated / totalWeight;
      sitepacks.Sites =  sitepacks.Sites.map(function(site) {
        site.allocatedTime = site.weight * timePerWeight;
        return site;
      });
    }
  });
