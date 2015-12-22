'use strict';

angular.module('weblistSavenub')
  .service('PackSessionService', function () {
    var pack, currentSite, timeSpentOnPage, timeSpentOnSession, timeStarted, pageNum, siteList, allocatedPackTime;

    var ONE_MIN = 1000 * 60;
    var TWO_MIN = 2000 * 60;
    var startSession = function(_pack, _siteList, _allocatedPackTime) {
      pack = _pack;
      siteList = _siteList;
      allocatedPackTime = _allocatedPackTime;
      pageNum = -1;
      timeSpentOnPage = [];
      timeSpentOnSession = 0;
      timeStarted = new Date().getTime();
      fileTimeArr();
    };

    var getNextPage = function() {
      timeSpentOnPage[pageNum].onRedirect = false;
      pageNum = pageNum + 1;
      var nextPage = siteList[pageNum];
      if(nextPage != undefined) {
        currentSite = nextPage;
        return currentSite;
      }
      else {
        return null;
      }
    };

    var peakNextPage = function() {
      return siteList[pageNum + 1];
    };

    var siteCount = function() {
      return siteList.length;
    };

    var getCurrentPage = function() {
      return siteList[pageNum];
    };

    var setPage = function(page) {
      if(page > siteList.length) return new Error("Page " + page + " does not exit");
      pageNum = page;
      currentSite = siteList[pageNum];
    };

    var hasNextPage = function() {
      return pageNum < siteCount() -1;
    };

    var getCurrentPageNum = function () {
      return pageNum;
    };

    var getPackTime = function() {
      return allocatedPackTime;
    };

    var getTimeStarted = function() {
      return timeStarted;
    };

    var getPageTimeSpent = function(page) {
      return timeSpentOnPage[page].spent;
    };

    var logTime = function() {
      if(timeSpentOnPage[pageNum].onRedirect == false) {
        var paused = false;
        if(timeSpentOnPage[pageNum].pauses.length > 0) {
          timeSpentOnPage[pageNum].pauses.foreach(pause => {
            if(pause.end === undefined) {
              console.log("found paused session, pause started at: " + pause.start);
              paused = true;
            }
          })
        }
        if(!paused) {
          timeSpentOnSession = new Date().getTime() - timeStarted;
          if(timeSpentOnPage[pageNum].started !== undefined) {
            timeSpentOnPage[pageNum].spent = new Date().getTime() - timeSpentOnPage[pageNum].started;
          }
          else {
            timeSpentOnPage[pageNum].started = new Date().getTime();
            timeSpentOnPage[pageNum].spent = 0;
          }
        }
      }
    };

    var isSiteExpiring = function() {
      var timeOnCurrentPage = timeSpentOnPage[pageNum].spent - getPauseTime();
      var allocatedTime = siteList[pageNum].allocatedTime*ONE_MIN;
      console.log((allocatedTime - timeOnCurrentPage) + ": " + (allocatedTime / 2.0 ) );
        if(allocatedTime - timeOnCurrentPage < ONE_MIN) {
        //less than a minute left, so we should show the warning unless the actual site is scheduled for a small time
        if(allocatedTime < TWO_MIN) {
          console.log((allocatedTime - timeOnCurrentPage) + ": " + (allocatedTime / 2.0 ) );
          return allocatedTime - timeOnCurrentPage < (allocatedTime / 2.0 );
        }
        else {
          return true;
        }
      }
      else {
        return false;
      }
    };

    var getExpireWarnTime = function(){
      var allocatedTimeMin = siteList[pageNum].allocatedTime*ONE_MIN;
      if((allocatedTimeMin) < TWO_MIN) {
        return (allocatedTimeMin) / 2.0;
      }
      else {
        return allocatedTimeMin - (allocatedTimeMin - ONE_MIN)
      }
    };

    var getPack = function() {
      return pack;
    };

    var restartSession = function() {
      pageNum = -1;
      timeSpentOnPage = [];
      timeStarted = new Date().getTime();
      fileTimeArr();
    };

    var fileTimeArr = function() {
      for(var i = 0; i< siteList.length; i++) {
        timeSpentOnPage[i] = {
          started: undefined,
          spent: 0,
          pauses: [],
          onRedirect : false
        };
      }
    };

    var pauseSession = function() {
      timeSpentOnPage[pageNum].pauses.push(
        {
          start: new Date().getTime(),
          end: undefined,
          onRedirect : false
        }
      );
    };

    var resumeSession = function() {
      if(timeSpentOnPage[pageNum].pauses.length > 0) {
        var lastPause = timeSpentOnPage[pageNum].pauses[timeSpentOnPage[pageNum].pauses -1];
        if(lastPause != undefined) {
          lastPause.end = new Date().getTime();
        }
      }
      else {
        console.log("Could not find a paused session for this page.")
      }
    };

    var getPauseTime = function() {
        var pauses = timeSpentOnPage[pageNum].pauses;
        var pauseTime = 0;
        pauses.forEach(pause => {
          if(pause.end !== undefined) {
            pauseTime += pause.end - pause.start;
          }
        });
        return pauseTime;
    };

    var setOnRedirect = function(isRedirect) {
      timeSpentOnPage[pageNum].onRedirect = isRedirect;
    };

    return {
      startSession      : startSession,
      getNextPage       : getNextPage,
      peakNextPage      : peakNextPage,
      siteCount         : siteCount,
      setPage           : setPage,
      hasNext           : hasNextPage,
      getCurrentPage    : getCurrentPage,
      getCurrentPageNum : getCurrentPageNum,
      getPackTime       : getPackTime,
      getTimeStarted    : getTimeStarted,
      getPageTimeSpent  : getPageTimeSpent,
      logTime           : logTime,
      isSiteExpiring    : isSiteExpiring,
      getExpireWarnTime : getExpireWarnTime,
      setOnRedirect     : setOnRedirect,
      pauseSession      : pauseSession,
      resumeSession     : resumeSession,
      getPauseTime      : getPauseTime,
      getPack           : getPack,
      restartSession    : restartSession
    }
  });
