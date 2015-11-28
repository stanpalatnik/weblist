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
        templateUrl: 'app/pack/templates/list.html',
        controller: 'ListPackCtrl',
        authenticate: true
      })
      .state('pack.new', {
        url: '/new',
        templateUrl: 'app/pack/templates/create.html',
        controller: 'PackCtrl',
        authenticate: true
      })
      .state('pack.show', {
        url: '/:packId',
        templateUrl: 'app/pack/templates/view.html',
        controller: 'ViewPackCtrl',
        authenticate: true
      })
      .state('pack.edit', {
        url: '/edit/:packId',
        templateUrl: 'app/pack/templates/edit.html',
        controller: 'EditPackCtrl',
        authenticate: true
      });
  });
