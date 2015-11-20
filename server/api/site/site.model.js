'use strict';

var validator = require('validator');

module.exports = function(sequelize, DataTypes) {
  var Site = sequelize.define("Site", {
    name    : { type: DataTypes.STRING, allowNull: false },
    url     : { type: DataTypes.STRING, allowNull: false, unique: true },
    active  : { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    classMethods: {
      associate: function(models) {
        console.log('models: ' + Object.keys(models));
        Site.belongsToMany(models.Pack, {through: 'SitePack'});
      }
    },
    paranoid: false
  });

  Site.hook('beforeValidate', function(site, options) {
    if(!validUrl(site.url)){
      return sequelize.Promise.reject('Validation Error: Invalid url');
    }
    if(!validator.isLength(site.name, 2)){
      return sequelize.Promise.reject('Validation Error: Site name is too short');
    }

    return sequelize.Promise.resolve(user);
  });

  return Site;
};

var validUrl = function(name) {
  return validator.isFQDN(name);
};
