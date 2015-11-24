'use strict';

module.exports = function(sequelize, DataTypes) {
  var SitePack = sequelize.define("SitePack", {
    id        : { type: DataTypes.INTEGER, primaryKey: true },
    weight    : { type: DataTypes.INTEGER, allowNull: false },
    position  : { type: DataTypes.INTEGER, allowNull: false }
  });

  return SitePack;
};
