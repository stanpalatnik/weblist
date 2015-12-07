'use strict';

angular.module('weblistSavenub')
  .directive('siteframe', ['PackSessionService', 'CountDownTimerFactory',function (PackSessionService, CountDownTimerFactory) {
    return {
      templateUrl: 'app/siteframe/siteframe.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        var time = PackSessionService.getPackTime();
        scope.manuallyClosed = false;
        scope.siteFinished = false;
        PackSessionService.setPage(0);
        scope.currentSite = PackSessionService.getCurrentPage();
        var sessionTab = window.open("http://" + scope.currentSite.domain);
        var timeOut = setTimeout(function() {
          if(!sessionTab.closed) {
            scope.siteFinished = true;
            sessionTab.close();
          }
        }, scope.currentSite.allocatedTime*1000 * 60);

        var intervalID = window.setInterval(function() {
          if(sessionTab.closed) {
            scope.$apply(function() {
              scope.manuallyClosed = true;
            });
            clearTimeout(timeOut);
            clearInterval(intervalID);
          }
        }, 500); //check to see if window was closed
      }
    };
  }]);
