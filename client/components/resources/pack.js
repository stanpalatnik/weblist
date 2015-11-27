'use strict';

angular.module('weblistSavenub')
  .factory('Pack', function ($resource) {
    return $resource('/api/packs/:id');
  });
