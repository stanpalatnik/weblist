/**
 * Main application file
 */

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var http = require('http');

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
