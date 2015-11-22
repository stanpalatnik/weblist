'use strict';

angular.module('weblistApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('packsession', {
        url: '/packsession',
        templateUrl: 'app/packsession/packsession.html',
        controller: 'PacksessionCtrl'
      });
  });
