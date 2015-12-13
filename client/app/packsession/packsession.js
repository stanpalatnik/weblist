'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('packsession', {
        abstract: true,
        url: '/packsession',
        template: '<ui-view/>'
      })
      .state('packsession.list', {
        url: '/',
        templateUrl: 'app/packsession/packsession.html',
        controller: 'PacksessionCtrl'
      })
      .state('packsession.view', {
        url: '/:packId/view',
        templateUrl: 'app/packsession/templates/view.html',
        controller: 'CreatePackSessionCtrl',
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
