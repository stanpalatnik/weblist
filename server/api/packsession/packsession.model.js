'use strict';

var validator = require('validator');

module.exports = function(sequelize, DataTypes) {
  var PackSession = sequelize.define("PackSession", {
    started  : { type: DataTypes.DATE, defaultValue: sequelize.fn('NOW'), allowNull: false },
    spent    : { type: DataTypes.INTEGER, allowNull: false }
  }, {
    classMethods: {
      associate: function(models) {
      }
    },
    paranoid: false
  });

  PackSession.hook('beforeValidate', function(PackSession, options) {
    if(!validDate(PackSession.started)){
      return sequelize.Promise.reject('Validation Error: Invalid start date');
    }
    return sequelize.Promise.resolve(PackSession);
  });

  return PackSession;
};

var validDate = function(date) {
  return validator.isDate(date);
};
