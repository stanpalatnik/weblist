'use strict';

angular.module('weblistSavenub')
  .service('PackSessionService', function () {
    var packId, currentSite, timeSpentOnPage, timeStarted, pageNum, siteList, allocatedPackTime;

    var startSession = function(_packId, _siteList, _allocatedPackTime) {
      packId = _packId;
      siteList = _siteList;
      allocatedPackTime = _allocatedPackTime;
      pageNum = -1;
      timeSpentOnPage = 0;
      timeStarted = new Date().getTime();
    };

    var getNextPage = function() {
      var nextPage = siteList(pageNum);
      if(nextPage != undefined) {
        currentSite = siteList[pageNum];
        pageNum = pageNum++;
      }
      return currentSite;
    };

    var siteCount = function() {
      return siteList.length;
    };

    var getCurrentPage = function() {
      return siteList[pageNum];
    };

    var setPage = function(page) {
      if(page > siteCount.length) throw "Page " + page + " does not exit"
      pageNum = page;
      currentSite = siteList[pageNum];
    };

    var getPackTime = function() {
      return allocatedPackTime;
    };


    return {
      startSession   : startSession,
      getNextPage    : getNextPage,
      siteCount      : siteCount,
      setPage        : setPage,
      getCurrentPage : getCurrentPage,
      getPackTime    : getPackTime
    }
  });
