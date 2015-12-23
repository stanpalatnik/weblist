'use strict';

angular.module('weblistSavenub')
  .directive('siteframe', ['PackSession','PackSessionService', 'CountDownTimerFactory', 'SiteNavigatorService',
    function (PackSession, PackSessionService, CountDownTimerFactory, SiteNavigatorService) {
    return {
      templateUrl: 'app/siteframe/siteframe.html',
      restrict: 'E',
      controller: function($scope) {
        var sessionWindow = null;
        var intervalID = null;

        var startSession = function() {
          PackSessionService.setPage(0);
          sessionWindow = SiteNavigatorService.openSite(PackSessionService.getCurrentPage());
          intervalID = window.setInterval(function () {
            if (sessionWindow.closed) {
              if (PackSessionService.peakNextPage() !== undefined) {
                $scope.$apply(function() {
                  $scope.manuallyClosed = true;
                });
              }
            }
          }, 1000); //check to see if window was closed
        };

        var pauseSession = function() {
          $scope.pausedSession = true;
          PackSessionService.pauseSession();
        };

        var resumeSession = function() {
          $scope.pausedSession = false;
          PackSessionService.resumeSession();
          console.log("paused for:" + PackSessionService.getPauseTime);
          SiteNavigatorService.openSite(PackSessionService.getCurrentPage());
        };

        this.pauseSession = pauseSession;
        this.resumeSession = resumeSession;
        this.startSession = startSession;
      },
      link: function (scope, element, attrs, ctrl) {
        scope.pack = PackSessionService.getPack();
        var time = PackSessionService.getPackTime();
        scope.manuallyClosed = false;
        scope.sessionFinished = false;
        scope.pausedSession = false;
        scope.siteFinished = false;
        scope.tabChannel = window.tabex.client();
        scope.tabChannel.on('savenub.packsession', function handler(message) {
          console.log(message);
          if(message === 'forward') {
            //let's proceed to the next page!
            if(PackSessionService.peakNextPage() !== undefined) {
              SiteNavigatorService.openSite(PackSessionService.getNextPage());
            }
            else {
              SiteNavigatorService.redirectFinished(PackSessionService.getPack(), PackSessionService.getCurrentPage());
            }
          }
          else if(message === 'back') {
            console.log("Received back command");
            SiteNavigatorService.openSite(PackSessionService.getCurrentPage());
            ctrl.pauseSession();
          }
          else if(message === 'pause') {
            console.log("Received pause command");
            ctrl.pauseSession();
          }
          else if(message === 'site.finished') {
            scope.siteFinished = true;
          }
          else if(message === 'restart') {
            console.log("Restarting session");
            scope.manuallyClosed = false;
            scope.sessionFinished = false;
            scope.pausedSession = false;
            scope.siteFinished = false;
            PackSessionService.restartSession();
            ctrl.startSession();
          }
        });
        ctrl.startSession();
      }
    };
  }]);
