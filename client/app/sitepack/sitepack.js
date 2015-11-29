'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sitepack', {
        url: '/sitepack',
        templateUrl: 'app/sitepack/sitepack.html',
        controller: 'SitepackCtrl'
      });
  });
