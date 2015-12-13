'use strict';

angular.module('weblistSavenub')
  .factory('Site', function ($resource) {
    return $resource('/api/sites/:id', null, {
      'update': { method:'PUT' }
    });
  });
