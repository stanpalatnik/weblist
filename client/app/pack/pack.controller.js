'use strict';

angular.module('weblistSavenub')
  .controller('PackCtrl', function ($scope, $state) {
    $scope.numbersOnly = /^\d+$/;
    $scope.pack = {};
    $scope.errors = {};

    $scope.createPack = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        console.log("creating pack: " + $scope.pack);
        createPackRequest($scope.pack, function(err, pack) {
          if(pack) {
            $state.go('pack.show');
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
      return $http.post('/api/pack', pack)
        .then(function(pack) {
          callback(null, pack);
        })
        .catch(function(err) {
          callback(err, null);
        });
    }
  });
