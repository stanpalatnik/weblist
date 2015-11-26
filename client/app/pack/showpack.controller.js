'use strict';

angular.module('weblistSavenub')
  .controller('ShowPackCtrl', function ($scope, $state) {
    $scope.packId = 0;
    $scope.pack = {};
    $scope.errors = {};

    $scope.getPack = function() {
      getPackRequest($scope.packId, function(err, pack) {
        if(pack) {
          $scope.pack = pack;
        }
        else {
          console.log(err);
          //display error message?
        }
      });
    };

    var getPackRequest = function(packId, callback) {
      return $http.get('/api/pack/' + packId)
        .then(function(pack) {
          callback(null, pack);
        })
        .catch(function(err) {
          callback(err, null);
        });
    }
  });
