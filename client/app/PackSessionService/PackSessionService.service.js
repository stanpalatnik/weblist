'use strict';

angular.module('weblistSavenub')
  .service('PackSessionService', function () {
    var pack, currentSite, timeSpentOnPage, timeStarted, pageNum, siteList, allocatedPackTime;

    var startSession = function(_pack, _siteList, _allocatedPackTime) {
      pack = _pack;
      siteList = _siteList;
      allocatedPackTime = _allocatedPackTime;
      pageNum = -1;
      timeSpentOnPage = 0;
      timeStarted = new Date().getTime();
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
      if(page > siteList.length) throw "Page " + page + " does not exit"
      pageNum = page;
      currentSite = siteList[pageNum];
    };

    var hasNextPage = function() {
      return pageNum < siteCount() -1;
    };

    var getPackTime = function() {
      return allocatedPackTime;
    };

    var getPack = function() {
      return pack;
    };

    return {
      startSession   : startSession,
      getNextPage    : getNextPage,
      peakNextPage   : peakNextPage,
      siteCount      : siteCount,
      setPage        : setPage,
      hasNext        : hasNextPage,
      getCurrentPage : getCurrentPage,
      getPackTime    : getPackTime,
      getPack        : getPack
    }
  });
