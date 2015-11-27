'use strict';

angular.module('weblistSavenub')
  .controller('PackCtrl', function ($scope, $state, Pack) {
    $scope.numbersOnly = /^\d+$/;
    $scope.pack = {};
    $scope.errors = {};

    $scope.createPack = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        createPackRequest($scope.pack, function(err, pack) {
          if(pack) {
            $state.go('pack.show', {packId : pack.id});
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

    var createPackRequest = function(pack, callback) {
      return Pack.save(pack,
        function(data) {
          return callback(null, data)
        },
        function(err) {
          return callback(err);
        }.bind(this)).$promise;
    }
  });
