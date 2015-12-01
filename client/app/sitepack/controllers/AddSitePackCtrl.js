'use strict';

angular.module('weblistSavenub')
  .controller('AddSitePackCtrl', function ($scope, SitePack, $stateParams) {
    $scope.numbersOnly = /^\d+$/;
    $scope.errors = {};
    $scope.site = {
      PackId: $stateParams.packId
    };
    $scope.sitepacks = SitePack.get({
      id: $stateParams.packId
    });


    $scope.addSite = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        addSiteToPack($scope.site, function(err, site) {
          if(site) {
            $state.go('sitepack.show', {packId : sitepacks.id});
          }
          else {
            console.log(err);
            angular.forEach(err.errors, function(error, field) {
              $scope.errors[field] = error.message;
            });
            console.log($scope.errors);
          }
        });
      }
    };

    var addSiteToPack = function(site, callback) {
      return SitePack.save(site,
        function(data) {
          return callback(null, data)
        },
        function(err) {
          return callback(err);
        }.bind(this)).$promise;
    }
  });
