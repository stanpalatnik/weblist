'use strict';

angular.module('weblistSavenub')
  .directive('siteframe', ['PackSession','PackSessionService', 'CountDownTimerFactory',function (PackSession, PackSessionService, CountDownTimerFactory) {
    return {
      templateUrl: 'app/siteframe/siteframe.html',
      restrict: 'E',
      controller: function($scope) {
        var sessionTab = null;
        var openSite = function(site) {
          if(sessionTab === null)  {
            var tabTitle = "savenub-" + req.user.id;
            sessionTab = window.open("http://" + site.domain, tabTitle);
          }
          else sessionTab.location = "http://" + site.domain;
          var timeOut, intervalID;
          timeOut = setTimeout(function() {
            if(!sessionTab.closed) {
              clearTimeout(timeOut);
              $scope.siteFinished = true;
              var nextSite = PackSessionService.getNextPage();
              if(nextSite != null) {
                redirectPrompt(nextSite);
                //openSite(nextSite);
              }
              else {
                sessionTab.close();
                $scope.sessionFinished = true;
              }
            }
          }, $scope.currentSite.allocatedTime*1000 * 60);

          intervalID = window.setInterval(function() {
            if(sessionTab.closed) {
              $scope.$apply(function() {
                $scope.manuallyClosed = true;
              });
              clearTimeout(timeOut);
              clearInterval(intervalID);
            }
          }, 500); //check to see if window was closed
        };
        this.openSite = openSite;
        var redirectPrompt = function(prevSite, nextSite) {
          //grab token to redirect to
          var token = PackSession.redirectUrl.get({
            id: $scope.pack.id,
            prev: prevSite.id,
            next: nextSite.id
          }, function(){
            console.log(token);
            console.log(token.token);
          });
        }
      },
      link: function (scope, element, attrs, ctrl) {
        scope.pack = PackSessionService.getPack();
        var time = PackSessionService.getPackTime();
        scope.manuallyClosed = false;
        scope.sessionFinished = false;
        scope.siteFinished = false;
        PackSessionService.setPage(0);
        scope.currentSite = PackSessionService.getCurrentPage();
        ctrl.openSite(scope.currentSite);
      }
    };
  }]);
