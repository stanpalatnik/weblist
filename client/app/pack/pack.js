'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pack', {
        url: '/pack',
        templateUrl: 'app/pack/pack.html',
        controller: 'PackCtrl',
        authenticate: true
      })
      .state('pack.show', {
        url: '/:packId',
        templateUrl: 'app/pack/show.html',
        controller: 'ShowPackCtrl',
        authenticate: true
      });
  });
