'use strict';

import passport from 'passport';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import Models from '../api/index';
import AuthService from '../auth.service'
var validateJwt = expressJwt({
  secret: config.secrets.session
});


/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasPermissionOnPack(packId) {
  if (!packId) {
    throw new Error('No pack id specified');
  }

  return compose()
    .use(AuthService.isAuthenticated())
    .use(function(req, res, next) {
      Models.Pack.find( { where: { userId : req.user._id } } )
        .then(function(pack) {
          if (!pack) {
            return res.status(401).end();
          }
          req.pack = pack;
          next();
        })
        .catch(function(err) {
          return next(err);
        });
    });
}
