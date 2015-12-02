'use strict';

var validator = require('validator');

module.exports = function(sequelize, DataTypes) {
  var Site = sequelize.define("Site", {
    domain     : { type: DataTypes.STRING, allowNull: false, unique: true },
    active  : { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    classMethods: {
      associate: function(models) {
        Site.belongsToMany(models.Pack, {through: "SitePack", foreignKey: {name: "SiteId", allowNull: false }, onDelete: 'CASCADE' });
      }
    },
    paranoid: false
  });

  Site.hook('beforeValidate', function(site, options) {
    if(!validUrl(site.domain)){
      return sequelize.Promise.reject('Validation Error: Invalid domain');
    }

    return sequelize.Promise.resolve(site);
  });

  return Site;
};

var validUrl = function(name) {
  return validator.isFQDN(name);
};
