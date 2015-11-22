/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var Models = require('../api/index');

Models.User.findOrCreate({
  where: {username: "Test_User"},
  defaults: {name: "Test User", password: "password123", email: "johny93@example.com"}
})
  .then(function (user, created) {
    console.log(user.values);
  })
  .catch(function (err) {
    console.log('Error occured' + err);
  });
