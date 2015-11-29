'use strict';

var validator = require('validator');

module.exports = function(sequelize, DataTypes) {
  var SessionSite = sequelize.define("SessionSite", {
    spent: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    classMethods: {
      associate: function(models) {
        models.PackSession.hasOne(models.SessionSite, { foreignKey: { name: "PackSessionId", allowNull: false }, onDelete: 'CASCADE' });
        models.Site.hasOne(models.SessionSite, { foreignKey: { name: "SiteId", allowNull: false }, onDelete: 'CASCADE' });
      }
    },
    timestamps: false
  });

  return SessionSite;
};
