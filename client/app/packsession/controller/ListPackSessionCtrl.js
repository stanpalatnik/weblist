'use strict';

angular.module('weblistSavenub')
  .controller('ListPackSessionCtrl', function ($scope, PackSession) {
    $scope.packSessionList = PackSession.query();
  });
