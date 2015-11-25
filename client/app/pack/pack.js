'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pack', {
        url: '/pack',
        templateUrl: 'app/pack/pack.html',
        controller: 'PackCtrl'
      });
  });
