/**
 * Packsession model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Packsession = require('./packsession.model');
var PacksessionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PacksessionEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Packsession.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PacksessionEvents.emit(event + ':' + doc._id, doc);
    PacksessionEvents.emit(event, doc);
  }
}

module.exports = PacksessionEvents;
