'use strict';

module.exports = function(sequelize, DataTypes) {
  var SitePack = sequelize.define("SitePack", {
    weight    : { type: DataTypes.INTEGER, allowNull: false }
  });

  return SitePack;
};
