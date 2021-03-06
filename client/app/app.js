'use strict';

angular.module('weblistSavenub', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'validation.match',
  'oc.lazyLoad',
  'ui.comments'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $ocLazyLoadProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  .config(function(commentsConfigProvider) {
    commentsConfigProvider.set({
      containerTemplate: 'components/comments/templates/comments.html',
      commentTemplate: 'components/comments/templates/comment.html',
      commentController: 'CommentCtrl',
      depthLimit: 4
    });
  })

  .factory('authInterceptor', function($rootScope, $q, $cookies, $injector) {
    var state;
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function($rootScope, $state, Auth) {
    // Redirect to login if route requires auth and the user is not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (next.authenticate) {
        Auth.isLoggedIn(function(loggedIn) {
          if (!loggedIn) {
            event.preventDefault();
            $state.go('login');
          }
        });
      }
    });
  });
