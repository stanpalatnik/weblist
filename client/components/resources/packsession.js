'use strict';

angular.module('weblistSavenub')
  .factory('PackSession', function ($resource) {
    return $resource('/api/packsessions/:id', null, {
      'update': { method:'PUT' }
    });
  });
