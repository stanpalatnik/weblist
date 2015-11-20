/**
 * Site model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Site = require('./site.model');
var SiteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SiteEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Site.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    SiteEvents.emit(event + ':' + doc._id, doc);
    SiteEvents.emit(event, doc);
  }
}

module.exports = SiteEvents;
