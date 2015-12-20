'use strict';

angular.module('weblistSavenub')
  .directive('siteframe', ['PackSession','PackSessionService', 'CountDownTimerFactory',function (PackSession, PackSessionService, CountDownTimerFactory) {
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
          var timeOut, intervalID;
          timeOut = setTimeout(function() {
            if(!sessionTab.closed) {
              clearTimeout(timeOut);
              $scope.siteFinished = true;
              var nextSite = PackSessionService.peakNextPage();
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
          }, $scope.currentSite.allocatedTime*1000 * 60);
          console.log("site scheduled for " + ($scope.currentSite.allocatedTime*1000 * 60) + "milliseconds");

          intervalID = window.setInterval(function() {
            if(sessionTab.closed) {
              $scope.$apply(function() {
                $scope.manuallyClosed = true;
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
          }, 500); //check to see if window was closed
        };
        var redirectPrompt = function(prevSite, nextSite) {
          //grab token to redirect to
          grabToken(prevSite, nextSite, function (token) {
            console.log("redirect token: " + token.token);
            sessionTab.location = "/nextlanding/" + token.token;
          });
        };

        var redirectWarning = function(cb) {
          var prevSite = PackSessionService.getCurrentPage();
          var nextSite = PackSessionService.peakNextPage();
          return grabToken(prevSite, nextSite, function (token) {
            console.log("redirect notification token: " + token.token);
            var notificationWindow = window.open("/nextlanding/notification" + token.token, "", "width=200, height=100");
            var intervalID = window.setInterval(function() {
              if(notificationWindow.closed) {
                clearInterval(intervalID);
              }
            }, 500); //check to see if window was closed
            cb(notificationWindow);
          });
        };

        var redirectFinished = function(lastSite) {
          //grab token to redirect to
          grabToken(lastSite, lastSite, function (token) {
            console.log("redirect token: " + token.token);
            sessionTab.location = "/nextlanding/last/" + token.token;
          });
        };

        var resumeSession = function() {
          $scope.pausedSession = false;
          openSite(PackSessionService.getNextPage());
        };

        var startSession = function() {
          PackSessionService.setPage(0);
          $scope.currentSite = PackSessionService.getCurrentPage();
          openSite($scope.currentSite);
        };

        var grabToken = function(prevSite, nextSite, callback) {
          var token = PackSession.redirectUrl({
            id: $scope.pack.id,
            prev: prevSite.id,
            next: nextSite.id
          }, function(){
            callback(token);
          });
        };

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
            ctrl.openSite(PackSessionService.getNextPage());
          }
          else if(message === 'back') {
            console.log("Received back command");
            scope.pausedSession = true;
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
