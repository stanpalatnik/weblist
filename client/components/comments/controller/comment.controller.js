'use strict';

angular.module('weblistSavenub')
  .controller('CommentCtrl', function($scope, $element, $timeout) {
    var children;
    $scope.collapsed = true;
    $scope.$on('$filledNestedComments', function(nodes) {
      $scope.collapsed = true;
      $timeout(function() {
        children = nodes;
        children.addClass('collapse').removeClass('in');
        children.collapse({
          toggle: false
        });
        // Stupid hack to wait for DOM insertion prior to setting up plugin
      }, 1);
    });
    $scope.$on('$emptiedNestedComments', function(nodes) {
      children = undefined;
    });
    $scope.collapse = function() {
      $scope.collapsed = children.hasClass('in');
      children.collapse('toggle');
    };

    $scope.addChildComment = function(comment) {
      var childComment = angular.extend(comment, {
        name: '@'+comment.name,
        date: new Date(),
        profileUrl: ''
      });
      if(!$scope.comment.children) {
        $scope.comment.children = [];
      }
      $scope.comment.children.push(childComment);
    };
  });
