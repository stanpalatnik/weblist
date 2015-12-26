'use strict';

var validator = require('validator');

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("Comment", {
    text    : { type: DataTypes.STRING, allowNull: false },
    date     : { type: DataTypes.DATE, defaultValue: sequelize.fn('NOW'), allowNull: false },
    deleted  : { type: DataTypes.BOOLEAN, defaultValue: false },
    upVotes  : { type: DataTypes.INTEGER, defaultValue: 0 },
    downVotes  : { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    classMethods: {
      associate: function(models) {
        Comment.hasMany(Comment, {as: 'childComments'});
        //Comment.belongsTo(models.User, { foreignKey: {name: "UserId", allowNull: false }, onDelete: 'CASCADE'});
        Comment.belongsTo(models.SitePack, { foreignKey: {name: "SitePackId", allowNull: false }, onDelete: 'CASCADE'});
      }
    },
    paranoid: false
  });

  Comment.hook('beforeValidate', function(comment, options) {
    if(!validComment(comment.name)){
      return sequelize.Promise.reject('Validation Error: Invalid comment');
    }
    return sequelize.Promise.resolve(comment);
  });

  return Comment;
};

var validComment = function(name) {
  return validator.isLength(name, 1);
};
