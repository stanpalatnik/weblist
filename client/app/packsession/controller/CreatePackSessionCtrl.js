'use strict';

angular.module('weblistSavenub')
  .controller('CreatePackSessionCtrl', function ($scope, PackSession) {
    $scope.packSessionList = PackSession.query();
  });
