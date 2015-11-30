'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sitepack', {
        abstract: true,
        url: '/sitepack',
        template: '<ui-view/>'
      })
      .state('sitepack.show', {
        url: '/:packId',
        templateUrl: 'app/sitepack/sitepack.html',
        controller: 'SitepackCtrl'
      })
      .state('sitepack.add', {
        url: '/:packId/add',
        templateUrl: 'app/sitepack/templates/addsitepack.html',
        controller: 'AddSitePackCtrl'
      })
      .state('sitepack.delete', {
        url: '/:packId/:siteId',
        templateUrl: 'app/sitepack/sitepack.html',
        controller: 'SitepackCtrl'
      });
  });
