'use strict';

var express = require('express');
var controller = require('./sitepack.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:packid', auth.isAuthenticated(), controller.index);
router.get('/:packid/:id', auth.isAuthenticated(), controller.show);
router.post('/:packid', auth.isAuthenticated(), controller.create);
router.put('/:packid', auth.isAuthenticated(), controller.update);
router.patch('/:packid/:id', auth.isAuthenticated(), controller.update);
router.delete('/:packid/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
