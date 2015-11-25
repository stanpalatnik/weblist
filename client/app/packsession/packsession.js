'use strict';

angular.module('weblistSavenub')
  .config(function ($stateProvider) {
    $stateProvider
      .state('packsession', {
        url: '/packsession',
        templateUrl: 'app/packsession/packsession.html',
        controller: 'PacksessionCtrl'
      });
  });
