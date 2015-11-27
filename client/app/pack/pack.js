'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pack', {
        abstract: true,
        url: '/pack',
        template: '<ui-view/>'
      })
      .state('pack.list', {
        url: '/list',
        templateUrl: 'app/pack/list.html',
        controller: 'ListPackCtrl',
        authenticate: true
      })
      .state('pack.new', {
        url: '/new',
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
