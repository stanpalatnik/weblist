'use strict';

angular.module('weblistSavenub')
  .controller('EditPackCtrl', function ($scope, Pack, $stateParams) {
    $scope.pack = Pack.get({id: $stateParams.packId});
    $scope.numbersOnly = /^\d+$/;
    $scope.errors = {};

    $scope.editPack = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        updatePackRequest($scope.pack, function(err, pack) {
          if(pack) {
            $state.go('pack.show', {packId : pack.id});
          }
          else {
            angular.forEach(err.errors, function(error, field) {
              $scope.errors[field] = error.message;
            });
            console.log($scope.errors);
          }
        });
      }
    };

    var updatePackRequest = function(pack, callback) {
      return Pack.update(pack,
        function(data) {
          return callback(null, data)
        },
        function(err) {
          return callback(err);
        }.bind(this)).$promise;
    }
  });
