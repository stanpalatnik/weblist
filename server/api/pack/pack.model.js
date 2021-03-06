'use strict';

var validator = require('validator');

module.exports = function(sequelize, DataTypes) {
  var Pack = sequelize.define("Pack", {
    name    : { type: DataTypes.STRING, allowNull: false },
    description    : { type: DataTypes.STRING, allowNull: true },
    time     : { type: DataTypes.INTEGER, allowNull: false },
    active  : { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    classMethods: {
      associate: function(models) {
        Pack.belongsTo(models.User, { foreignKey: {name: "UserId", allowNull: false }, onDelete: 'CASCADE'});
        Pack.hasMany(models.PackSession, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        Pack.belongsToMany(models.Site, {through: "SitePack", foreignKey: {name: "PackId", allowNull: false }, onDelete: 'CASCADE' });
      }
    },
    paranoid: false
  });

  Pack.hook('beforeValidate', function(pack, options) {
    if(!validName(pack.name)){
      return sequelize.Promise.reject('Validation Error: Invalid url');
    }
    if(!validTime(pack.time)){
      return sequelize.Promise.reject('Validation Error: Site name is too short');
    }

    return sequelize.Promise.resolve(pack);
  });

  return Pack;
};

var validName = function(name) {
  return validator.isLength(name, 1);
};

var validTime = function(time) {
  return validator.isInt(time);
};
