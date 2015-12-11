'use strict';

angular.module('weblistSavenub')
  .factory('PackSession', function ($resource) {
    return $resource('/api/packsessions/:id/:controller/:prev/:next', null, {
      'update': { method:'PUT' },
      redirectUrl: {
        method: 'GET',
        params: {
          controller:'redirectUrl'
        }
      }
    });
  });
