'use strict';

angular.module('weblistSavenub')
  .service('NotificationWindowService', ['PackSessionService', 'PackUtilService', function (PackSessionService, PackUtilService) {

    var notificationWindow = null;

    var redirectWarning = function(cb) {
      var prevSite = PackSessionService.getCurrentPage();
      var nextSite = PackSessionService.peakNextPage() || prevSite;
      return PackUtilService.grabToken(PackSessionService.getPack().id, prevSite, nextSite, function (token) {
        console.log("redirect notification token: " + token.token);
        notificationWindow = window.open("/nextlanding/notification" + token.token, "", "width=200, height=100");
        var intervalID = window.setInterval(function() {
          if(notificationWindow.closed) {
            clearInterval(intervalID);
          }
        }, 1000); //check to see if window was closed
        cb(intervalID);
      });
    };

    var getNotificationWindow = function() {
      return notificationWindow;
    };

    var closeWindow = function() {
      if(notificationWindow != null && notificationWindow !== undefined) {
        notificationWindow.close();
      }
    };

    var isOpen = function() {
      return notificationWindow != null && notificationWindow !== undefined && !notificationWindow.closed
    };

    return {
      redirectWarning          : redirectWarning,
      getNotificationWindow    : getNotificationWindow,
      closeWindow              : closeWindow,
      isOpen                   : isOpen
    }
  }]
);
