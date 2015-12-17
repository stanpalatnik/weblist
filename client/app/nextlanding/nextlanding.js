'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('nextlanding', {
        url: '/nextlanding/:token',
        templateUrl: 'app/nextlanding/nextlanding.html',
        controller: 'NextlandingCtrl',
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                files: ['bower_components/tabex/dist/tabex.min.js']
              }
            ]);
          }
        }
      })
      .state('nextlanding.notification', {
        url: '/nextlanding/notification/:token',
        templateUrl: 'app/nextlanding/nextlanding.html',
        controller: 'NextlandingCtrl',
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                files: ['bower_components/tabex/dist/tabex.min.js']
              }
            ]);
          }
        }
      });
  });
