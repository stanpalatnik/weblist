'use strict';

angular.module('weblistSavenub')
  .controller('NextlandingCtrl', function ($scope, PackSession, $stateParams) {
    var token = $stateParams.token;

    $scope.tokenData = PackSession.parseRedirect({
      //pigeon hole this request in the packsession resource. should refactor into it's own resource
      id: 0,
      prev: token
    }, function(){
      console.log($scope.tokenData);
    });
  });
