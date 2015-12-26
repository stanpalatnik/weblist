'use strict';

module.exports = function(sequelize, DataTypes) {
  var SitePack = sequelize.define("SitePack", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
      name         : { type: DataTypes.STRING,  allowNull: false },
    description  : DataTypes.STRING,
    weight       : { type: DataTypes.INTEGER, allowNull: false },
    position     : { type: DataTypes.INTEGER, allowNull: false }
  }, {
    classMethods: {
      associate: function(models) {
        SitePack.hasOne(models.Comment, { foreignKey: {name: "SitePackId", allowNull: false }, onDelete: 'CASCADE'});
      }
    },
    timestamps: false
  });
  return SitePack;
};
