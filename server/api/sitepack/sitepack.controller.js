/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/sitepacks              ->  index
 * POST    /api/sitepacks              ->  create
 * GET     /api/sitepacks/:id          ->  show
 * PUT     /api/sitepacks/:id          ->  update
 * DELETE  /api/sitepacks/:id          ->  destroy
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
      .spread(function(updated) {
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

// Gets a list of Sites for this Pack
exports.index = function(req, res) {
  Models.SitePack.findAll({
    where: { packId: req.params.packId}
  })
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Site configured with this Pack from the DB
exports.show = function(req, res) {
  Models.SitePack.find({
    where: {
      id: req.params.sitePackId
    },
    include: [Models.Site]
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Adds a Site to an existing Pack in the DB
exports.create = function(req, res) {
  Models.SitePack.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Site for this Pack in the DB
exports.update = function(req, res) {
  Models.SitePack.findById(req.params.sitePackId)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Site from a Pack from the DB
exports.destroy = function(req, res) {
  Models.SitePack.findById(req.params.sitePackId)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
