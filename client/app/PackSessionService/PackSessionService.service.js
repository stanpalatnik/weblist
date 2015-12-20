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
      var nextPage = siteList[pageNum + 1];
      if(nextPage != undefined) {
        return nextPage;
      }
      else {
        return null;
      }
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
      timeSpentOnSession = new Date().getTime() - timeStarted;
      if(timeSpentOnPage[pageNum].started !== undefined) {
        timeSpentOnPage[pageNum].spent = new Date().getTime() - timeSpentOnPage[pageNum].started;
      }
      else {
        timeSpentOnPage[pageNum].started = new Date().getTime();
        timeSpentOnPage[pageNum].spent = 0;
      }
    };

    var isSiteExpiring = function() {
      var timeOnCurrentPage = timeSpentOnPage[pageNum].spent;
      if((siteList[pageNum].allocatedTime*ONE_MIN) - timeOnCurrentPage < ONE_MIN) {
        //less than a minute left, so we should show the warning unless the actual site is scheduled for a small time
        if((siteList[pageNum].allocatedTime* ONE_MIN) < TWO_MIN) {
          console.log(((siteList[pageNum].allocatedTime * ONE_MIN) - timeOnCurrentPage) + ": " + ((siteList[pageNum].allocatedTime * ONE_MIN) / 2.0 ) );
          return (siteList[pageNum].allocatedTime * ONE_MIN) - timeOnCurrentPage < ((siteList[pageNum].allocatedTime * ONE_MIN) / 2.0 );
        }
        else {
          return true;
        }
      }
      else {
        return false;
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
          spent: 0
        };
      }
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
      getPack           : getPack,
      restartSession    : restartSession
    }
  });
