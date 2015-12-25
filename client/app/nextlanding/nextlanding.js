'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('nextlanding', {
        abstract: true,
        url: '/nextlanding',
        template: '<ui-view/>'
      })
      .state('nextlanding.prompt', {
        url: '/:token',
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
        url: '/notification/:token',
        templateUrl: 'app/nextlanding/templates/notification.html',
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
      .state('nextlanding.last', {
        url: '/last/:token',
        templateUrl: 'app/nextlanding/finished.html',
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
