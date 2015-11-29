'use strict';

angular.module('weblistSavenub')
  .controller('SignupCtrl', function($scope, Auth, $state) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUser($scope.user)
        .then(function() {
          // Account created, redirect to home
            console.log("created user");
          $state.go('main');
        })
        .catch(function(err) {
          err = err.data;
          $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[error.path].$setValidity('database', false);
            $scope.errors[error.path] = error.message;
          });
        });
      }
    };

  });
