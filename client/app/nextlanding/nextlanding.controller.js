'use strict';

angular.module('weblistSavenub')
  .controller('NextlandingCtrl', function ($scope, $q, PackSession, Site, $stateParams) {
    var token = $stateParams.token;
    var tabChannel = window.tabex.client();

    $scope.tokenData = PackSession.parseRedirect({
      //pigeon hole this request in the packsession resource. should refactor into it's own resource
      id: 0,
      prev: token
    }, function(){
      $q.all([
        getSite($scope.tokenData.prevSiteId),
        getSite($scope.tokenData.nextSiteId)
      ]).then(function(data) {
        $scope.prevSite = data[0];
        $scope.nextSite = data[1];
      });
    });

    function getSite(siteId) {
      var d = $q.defer();
      var result = Site.get({
        id: siteId
      }, function() {
        d.resolve(result);
      });
      return d.promise;
    }

    $scope.respondNext = function() {
      sendMessage('forward');
    };

    $scope.respondBack = function() {
      sendMessage('back');
      window.history.back();
    };

    var sendMessage = function(message) {
      tabChannel.emit('savenub.packsession', message);
    };

    /* Comment test data */
    $scope.comments = [
      {
        name: '@caitp',
        date: new Date(),
        profileUrl: 'https://github.com/caitp',
        text: 'UI-Comments is designed to simplify the process of creating comment systems similar to Reddit, Imgur or Discuss in AngularJS.',
        children: [{
          name: '@bizarro-caitp',
          date: new Date(),
          profileUrl: 'https://github.com/bizarro-caitp',
          text: 'We support nested comments, in a very simple fashion. It\'s great!',
          children: [{
            name: '@caitp',
            date: new Date(),
            profileUrl: 'https://github.com/caitp',
            text: 'These nested comments can descend arbitrarily deep, into many levels. This can be used to reflect a long and detailed conversation about typical folly which occurs in comments',
            children: [{
              name: '@bizarro-caitp',
              date: new Date(),
              profileUrl: 'https://github.com/bizarro-caitp',
              text: 'Having deep conversations on the internet can be used to drive and derive data about important topics, from marketing demographic information to political affiliation and even sexual orientation if you care to find out about that. Isn\'t that exciting?'
            }]
          },{
            name: '@bizarro-caitp',
            date: new Date(),
            profileUrl: 'https://github.com/bizarro-caitp',
            text: 'Is it REALLY all that wonderful? People tend to populate comments with innane nonsense that ought to get them hellbanned!',
            comments: [{
              name: '@caitp',
              date: new Date(),
              profileUrl: 'https://github.com/caitp',
              text: 'Oh whatever lady, whatever'
            }]
          }]
        }]
      }, {
        name: '@caitp',
        date: new Date(),
        profileUrl: 'https://github.com/caitp',
        text: 'We can have multiple threads of comments at a given moment...',
      }, {
        name: '@bizarro-caitp',
        date: new Date(),
        profileUrl: 'https://github.com/bizarro-caitp',
        text: 'We can do other fancy things too, maybe...',
        children: [{
          name: '@caitp',
          date: new Date(),
          profileUrl: 'https://github.com/caitp',
          text: '...other fancy things, you say?',
        }, {
          name: '@caitp',
          date: new Date(),
          profileUrl: 'https://github.com/caitp',
          text: 'suddenly I\'m all curious, what else can we do...',
          children: [{
            name: '@bizarro-caitp',
            date: new Date(),
            profileUrl: 'https://github.com/bizarro-caitp',
            text: 'Oh, you\'ll see...',
          }]
        }]
      }];

    $scope.addParentComment = function(comment) {
      var parentComment = angular.extend(comment, {
        name: '@'+comment.name,
        date: new Date(),
        profileUrl: 'https://github.com/' + comment.name
      });
      $scope.comments.push(parentComment);
    };
  });
