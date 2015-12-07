'use strict';

angular.module('weblistSavenub')
  .directive('siteframe', ['PackSessionService', 'CountDownTimerFactory',function (PackSessionService, CountDownTimerFactory) {
    return {
      templateUrl: 'app/siteframe/siteframe.html',
      restrict: 'E',
      controller: function(scope) {
        this.openSite = function(site) {
          var sessionTab = window.open("http://" + site.domain);
          var timeOut, intervalID;
          timeOut = setTimeout(this.timeoutCb(sessionTab(timeOut, intervalID)), scope.currentSite.allocatedTime*1000 * 60);

          intervalID = window.setInterval(function() {
            if(sessionTab.closed) {
              scope.$apply(function() {
                scope.manuallyClosed = true;
              });
              clearTimeout(timeOut);
              clearInterval(intervalID);
            }
          }, 500); //check to see if window was closed
        };

        this.timeoutCb = function(sessionTab, timeOut, intervalID) {
          if(!sessionTab.closed) {
            clearTimeout(timeOut);
            clearInterval(intervalID);
            scope.siteFinished = true;
            sessionTab.close();
            var nextSite = PackSessionService.getNextPage();
            if(nextSite != null) {
              this.openSite(nextSite);
            }
          }
        };
      },
      link: function (scope, element, attrs, ctrl) {
        var time = PackSessionService.getPackTime();
        scope.manuallyClosed = false;
        scope.siteFinished = false;
        PackSessionService.setPage(0);
        scope.currentSite = PackSessionService.getCurrentPage();
        ctrl.openSite(scope.currentSite);
      }
    };
  }]);
