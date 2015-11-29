'use strict';

module.exports = function(sequelize, DataTypes) {
  var SitePack = sequelize.define("SitePack", {
    weight    : { type: DataTypes.INTEGER, allowNull: false },
    position  : { type: DataTypes.INTEGER, allowNull: false }
  }, {
    timestamps: false
  });
  return SitePack;
};
