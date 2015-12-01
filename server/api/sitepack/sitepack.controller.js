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
    console.log(err);
    res.status(statusCode).send(err);
  };
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
    return entity;
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
  Models.Pack.findOne({
    where: { id: req.params.packid},
    include: [
    {
      model: Models.Site,
      required: false
    },
    {
      model: Models.User,
      where: {id: req.user.id},
      attributes: ['id'],
      required: true
    }]
  })
    .then(responseWithResult(res))
    .then(handleEntityNotFound(res))
    .catch(handleError(res));
};

// Gets a single Site configured with this Pack from the DB
exports.show = function (req, res) {
  Models.SitePack.find({
    where: {
      id: req.params.SitePackId
    },
    include: [{
      model: Models.User,
      where: {id: req.user.id},
      required: true
    },
      {
        model: Models.Site,
        required: true
      }]
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Adds a Site to an existing Pack in the DB
exports.create = function (req, res) {
  Models.Site.findOrCreate({
    where: {
      url: req.body.url
    },
    defaults: {
      name: req.body.name,
      url: req.body.url,
      active: true
    }
  })
    .then(function (site) {
      console.log("fd" + site.dataValues);
      console.log(site.values);
      console.log("siteid: " + site.dataValues.id);
      req.body.SiteId = site.id;
      req.body.position = req.body.position || 1;
      Models.SitePack.findAll({
        where: {
          position: req.body.position
        }
      })
        .then(function (SitePackList) {
          console.log(SitePackList);
          if(SitePackList.length > 0) {
            throw "A site in this position already exists"
          }
          else {
            Models.SitePack.create(req.body)
              .then(responseWithResult(res, 201))
              .catch(validationError(res));
          }
        })
        .catch(handleError(res));
    })
    .catch(validationError(res));
};

// Updates an existing Site for this Pack in the DB
exports.update = function(req, res) {
  Models.SitePack.find({
    where: {
      id: req.params.sitePackId
    },
    include: [{
      model: Models.User,
      where: { id: req.user.id },
      required: true
    }]
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Site from a Pack from the DB
exports.destroy = function(req, res) {
  Models.SitePack.find({
    where: {
      id: req.params.sitePackId
    },
    include: [{
      model: Models.User,
      where: { id: req.user.id },
      required: true
    }]
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
