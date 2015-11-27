/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/packs              ->  index
 * POST    /api/packs              ->  create
 * GET     /api/packs/:id          ->  show
 * PUT     /api/packs/:id          ->  update
 * DELETE  /api/packs/:id          ->  destroy
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
    return updated.save()
      .then(function() {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Packs
exports.index = function(req, res) {
  Models.Pack.findAll({
    where: { UserId: req.user.id }
  })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Pack from the DB
exports.show = function(req, res) {
  Models.Pack.find({
    where: {
      id: req.params.id,
      UserId: req.user.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Pack in the DB
exports.create = function(req, res) {
  req.body.UserId = req.user.id;
  Models.Pack.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Pack in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Models.Pack.find({
    where: {
      id: req.params.id,
      UserId: req.user.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Pack from the DB
exports.destroy = function(req, res) {
  Models.Pack.find({
    where: {
      id: req.params.id,
      UserId: req.user.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
