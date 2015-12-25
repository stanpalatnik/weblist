'use strict';

angular.module('weblistSavenub')
  .service('SiteNavigatorService', ['PackSessionService', 'NotificationWindowService', 'PackUtilService',
    function (PackSessionService, NotificationWindowService, PackUtilService) {

      var sessionWindow = null;
      var tabChannel = window.tabex.client();

      var openSite = function (site) {
        var pack = PackSessionService.getPack();
        var notificationShown = false;
        if (sessionWindow === null) {
          var tabTitle = "savenub-" + pack.UserId + pack.id;
          sessionWindow = window.open("http://" + site.domain, tabTitle);
        }
        else sessionWindow.location = "http://" + site.domain;
        var timeOut, intervalID, notificationTimeout;
        timeOut = setTimeout(function () {
          if (!sessionWindow.closed) {
            if (PackSessionService.isSiteExpiring()) {
              clearTimeout(timeOut);
              clearTimeout(notificationTimeout);
              tabChannel.emit('savenub.packsession', 'site.finished');
              var nextSite = PackSessionService.peakNextPage();
              if (notificationShown) {
                NotificationWindowService.closeWindow();
              }
              if (nextSite != null) {
                redirectPrompt(pack, site, nextSite);
              }
              else {
                redirectFinished(pack, site);
              }
            }
            else {
              console.log("failed to redirect since not expiring?");
            }
          }
        }, site.allocatedTime * 1000 * 60);
        console.log("site scheduled for " + (site.allocatedTime * 1000 * 60) + "milliseconds");

        intervalID = window.setInterval(function () {
          if (sessionWindow.closed) {
            clearTimeout(timeOut);
            clearInterval(intervalID);
            if (notificationShown && NotificationWindowService.isOpen()) {
              NotificationWindowService.closeWindow();
            }
          }
          else {
            PackSessionService.logTime();
            if (PackSessionService.isSiteExpiring()) {
              //less than a minute left allocated for this site
              if (!notificationShown) {
                notificationShown = true;
                NotificationWindowService.redirectWarning(function (notificationIntervalRef) {
                });
              }
            }
          }
        }, 1000); //check to see if window was closed


        tabChannel.on('savenub.packsession', function handler(message) {
          PackSessionService.setOnRedirect(false);
          console.log("inside sitenavservice: " + message);
          clearTimeout(timeOut);
          clearTimeout(notificationTimeout);
          clearInterval(intervalID);
          if (notificationShown && NotificationWindowService.isOpen()) {
            NotificationWindowService.closeWindow();
          }
        });

        return sessionWindow;
      };

      var redirectPrompt = function (pack, prevSite, nextSite) {
        //grab token to redirect to
        PackUtilService.grabToken(pack.id, prevSite, nextSite, function (token) {
          console.log("redirect token: " + token.token);
          sessionWindow.location = "/nextlanding/" + token.token;
          PackSessionService.setOnRedirect(true);
        });
      };

      var redirectFinished = function (pack, lastSite) {
        //grab token to redirect to
        PackUtilService.grabToken(pack.id, lastSite, lastSite, function (token) {
          console.log("redirect token: " + token.token);
          sessionWindow.location = "/nextlanding/last/" + token.token;
          PackSessionService.setOnRedirect(true);
        });
      };

      var getSessionWindow = function() {
        return sessionWindow;
      };

      return {
        openSite         : openSite,
        getSessionWindow : getSessionWindow,
        redirectFinished : redirectFinished
      }

    }]);
