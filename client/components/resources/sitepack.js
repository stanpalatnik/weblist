'use strict';

angular.module('weblistSavenub')
  .factory('SitePack', function ($resource) {
    return $resource('/api/sitepacks/:id/:siteid', {
      id: '@PackId'
    }, {
      'update': { method:'PUT' }
    });
  });
