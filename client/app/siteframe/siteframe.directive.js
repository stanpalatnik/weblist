'use strict';

angular.module('weblistSavenub')
  .directive('siteframe', ['PackSession','PackSessionService', 'CountDownTimerFactory', 'PackUtilService',function (PackSession, PackSessionService, CountDownTimerFactory, PackUtilService) {
    return {
      templateUrl: 'app/siteframe/siteframe.html',
      restrict: 'E',
      controller: function($scope) {
        var sessionTab = null;
        var notificationWindow = null;
        var openSite = function(site) {
          var notificationShown = false;
          if(sessionTab === null)  {
            var tabTitle = "savenub-" + $scope.pack.UserId + $scope.pack.id;
            sessionTab = window.open("http://" + site.domain, tabTitle);
          }
          else sessionTab.location = "http://" + site.domain;
          var timeOut, intervalID, notificationTimeout;
          timeOut = setTimeout(function() {
            if(!sessionTab.closed) {
              clearTimeout(timeOut);
              clearTimeout(notificationTimeout);
              $scope.siteFinished = true;
              var nextSite = PackSessionService.peakNextPage();
              if(PackSessionService.isSiteExpiring()) {
                if(notificationShown) {
                  notificationWindow.close();
                }
                if(nextSite != null) {
                  redirectPrompt(site, nextSite);
                }
                else {
                  redirectFinished(site);
                  $scope.sessionFinished = true;
                }
              }
              else {
                console.log("failed to redirect since not expiring?");
              }
            }
          }, $scope.currentSite.allocatedTime*1000 * 60);
          console.log("site scheduled for " + ($scope.currentSite.allocatedTime*1000 * 60) + "milliseconds");

          notificationTimeout = window.setTimeout(function(){
            PackSessionService.logTime();
            if(PackSessionService.isSiteExpiring()) { //make sure we didn't have any pauses
              if(!notificationShown) {
                redirectWarning(function(notificationW) {
                  notificationWindow = notificationW;
                });
                notificationShown = true;
              }
            }
          }, PackSessionService.getExpireWarnTime());

          intervalID = window.setInterval(function() {
            if(sessionTab.closed) {
              $scope.$apply(function() {
                if(!$scope.sessionFinished) {
                  $scope.manuallyClosed = true;
                  pauseSession();
                }
              });
              clearTimeout(timeOut);
              clearInterval(intervalID);
              if(notificationShown && !notificationWindow.closed) {
                notificationWindow.close();
              }
            }
            else {
              PackSessionService.logTime();
              if(PackSessionService.isSiteExpiring()) {
                //less than a minute left allocated for this site
                if(!notificationShown) {
                  redirectWarning(function(notificationW) {
                    notificationWindow = notificationW;
                  });
                  notificationShown = true;
                }
              }
            }
          }, 1000); //check to see if window was closed

          $scope.tabChannel.on('savenub.packsession', function handler(message) {
            PackSessionService.setOnRedirect(false);
            console.log(message);
            clearTimeout(timeOut);
            clearTimeout(notificationTimeout);
            clearInterval(intervalID);
            if(notificationShown && !notificationWindow.closed) {
              notificationWindow.close();
            }
          });
        };

        var redirectPrompt = function(prevSite, nextSite) {
          //grab token to redirect to
          PackUtilService.grabToken($scope.pack.id, prevSite, nextSite, function (token) {
            console.log("redirect token: " + token.token);
            sessionTab.location = "/nextlanding/" + token.token;
            PackSessionService.setOnRedirect(true);
          });
        };

        var redirectWarning = function(cb) {
          var prevSite = PackSessionService.getCurrentPage();
          var nextSite = PackSessionService.peakNextPage() || prevSite;
          return PackUtilService.grabToken($scope.pack.id, prevSite, nextSite, function (token) {
            console.log("redirect notification token: " + token.token);
            var notificationWindow = window.open("/nextlanding/notification" + token.token, "", "width=200, height=100");
            var intervalID = window.setInterval(function() {
              if(notificationWindow.closed) {
                clearInterval(intervalID);
              }
            }, 1000); //check to see if window was closed
            cb(notificationWindow);
          });
        };

        var redirectFinished = function(lastSite) {
          //grab token to redirect to
          PackUtilService.grabToken($scope.pack.id, lastSite, lastSite, function (token) {
            console.log("redirect token: " + token.token);
            sessionTab.location = "/nextlanding/last/" + token.token;
            PackSessionService.setOnRedirect(true);
          });
        };

        var startSession = function() {
          PackSessionService.setPage(0);
          $scope.currentSite = PackSessionService.getCurrentPage();
          openSite($scope.currentSite);
        };

        var pauseSession = function() {
          $scope.pausedSession = true;
          PackSessionService.pauseSession();
        };

        var resumeSession = function() {
          $scope.pausedSession = false;
          PackSessionService.resumeSession();
          console.log("paused for:" + PackSessionService.getPauseTime);
          openSite(PackSessionService.getCurrentPage());
        };

        this.pauseSession = pauseSession;
        this.openSite = openSite;
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
            scope.currentSite = PackSessionService.getNextPage();
            ctrl.openSite(scope.currentSite);
          }
          else if(message === 'back') {
            console.log("Received back command");
            ctrl.openSite(PackSessionService.getCurrentPage());
            ctrl.pauseSession();
          }
          else if(message === 'pause') {
            console.log("Received pause command");
            ctrl.pauseSession();
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
