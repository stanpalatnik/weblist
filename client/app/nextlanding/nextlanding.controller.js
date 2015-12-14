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
      console.log($scope.tokenData);

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
    };

    var sendMessage = function(message) {
      tabChannel.emit('savenub.packsession', message);
    };
  });
