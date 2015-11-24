'use strict';

var validator = require('validator');

module.exports = function(sequelize, DataTypes) {
  var SessionSite = sequelize.define("SessionSite", {
    spent: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    classMethods: {
      associate: function(models) {
        models.PackSession.hasOne(models.SessionSite);
        models.SitePack.hasOne(models.SessionSite);
      }
    }
  });

  return SessionSite;
};
