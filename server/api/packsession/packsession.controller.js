/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/packsessions              ->  index
 * POST    /api/packsessions              ->  create
 * GET     /api/packsessions/:id          ->  show
 * PUT     /api/packsessions/:id          ->  update
 * DELETE  /api/packsessions/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
import Models from '../index';

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of PackSessions
exports.index = function(req, res) {

  Models.PackSession.findAll({
    include: [
      {
        model: Models.Pack,
        include : [
          {
            model: Models.User,
            where: { id: req.user.id },
            required: true
          }
        ],
        required: true
      }
    ]
  })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single PackSession from the DB
exports.show = function(req, res) {
  Models.PackSession.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new PackSession in the DB
exports.create = function(req, res) {
  Models.PackSession.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing PackSession in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Models.PackSession.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a PackSession from the DB
exports.destroy = function(req, res) {
  Models.PackSession.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
