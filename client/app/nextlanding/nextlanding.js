'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('nextlanding', {
        url: '/nextlanding/:token',
        templateUrl: 'app/nextlanding/nextlanding.html',
        controller: 'NextlandingCtrl'
      });
  });
