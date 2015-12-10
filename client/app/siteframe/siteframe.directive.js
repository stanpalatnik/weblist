'use strict';

angular.module('weblistSavenub')
  .directive('siteframe', ['PackSessionService', 'CountDownTimerFactory',function (PackSessionService, CountDownTimerFactory) {
    return {
      templateUrl: 'app/siteframe/siteframe.html',
      restrict: 'E',
      controller: function($scope) {
        var sessionTab = null;
        var openSite = function(site) {
          if(sessionTab === null)  {
            sessionTab = window.open("http://" + site.domain);
          }
          else sessionTab.location = "http://" + site.domain;
          var timeOut, intervalID;
          timeOut = setTimeout(function() {
            if(!sessionTab.closed) {
              clearTimeout(timeOut);
              clearInterval(intervalID);
              $scope.siteFinished = true;
              sessionTab.close();
              var nextSite = PackSessionService.getNextPage();
              if(nextSite != null) {
                openSite(nextSite);
              }
              else {
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
        this.openSite =  openSite;
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
