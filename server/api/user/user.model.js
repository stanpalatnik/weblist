'use strict';

var crypto = require('crypto');
var validator = require('validator');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name    : DataTypes.STRING,
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email   : { type: DataTypes.STRING, allowNull: false, unique: true },
    role    : { type: DataTypes.STRING, defaultValue: 'user' },
    password: { type: DataTypes.STRING, allowNull: false },
    salt    : { type: DataTypes.STRING },
    provider: { type: DataTypes.STRING, defaultValue: 'local' }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasOne(models.Pack, { foreignKey: {name: "UserId", allowNull: false }, onDelete: 'CASCADE'} );
        User.hasOne(models.Comment, { foreignKey: {name: "UserId", allowNull: false }, onDelete: 'CASCADE'});
      },
      validEmail: validEmail,
      validPassword: validPassword
    },
    paranoid: false,
    instanceMethods: {
      authenticate: authenticate,
      encryptPassword: encryptPassword
    }
  });

  User.hook('beforeValidate', function(user, options) {
    if(!validEmail(user.email)){
      return sequelize.Promise.reject('Validation Error: Invalid email');
    }

    if(!validPassword(user.password)){
      return sequelize.Promise.reject('Validation Error: Password does not meet requirements');
    }

    return sequelize.Promise.resolve(user);
  });

  User.hook('beforeCreate', function(user, options) {
    user.salt = makeSalt(64);
    user.password = user.encryptPassword();
  });

  return User;
};

var validPassword = function(password) {
  if(!validator.isAlphanumeric(password) || !validator.isLength(password, 6)){
    return false;
  }
  return true;
};

var validEmail = function(email) {
  return validator.isEmail(email);
};

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Make salt
 *
 * @param {Number} byteSize Optional salt byte size, default to 16
 * @param {Function} callback
 * @return {String}
 * @api public
 */
var makeSalt = function(byteSize, callback) {
  var defaultByteSize = 16;

  if (typeof arguments[0] === 'function') {
    callback = arguments[0];
    byteSize = defaultByteSize;
  }
  else if (typeof arguments[1] === 'function') {
    callback = arguments[1];
  }

  if (!byteSize) {
    byteSize = defaultByteSize;
  }

  if (!callback) {
    return crypto.randomBytes(byteSize).toString('base64');
  }

  return crypto.randomBytes(byteSize, function(err, salt) {
    if (err) {
      callback(err);
    }
    return callback(null, salt.toString('base64'));
  });
};

/** Encrypt password
*
* @param {String} password
* @param {Function} callback
* @return {String}
  * @api public
*/
var encryptPassword = function(password, callback) {
  if (!this.password || !this.salt) {
    return null;
  }

  var defaultIterations = 10000;
  var defaultKeyLength = 64;

  if (!callback) {
    return crypto.pbkdf2Sync(this.password, this.salt, defaultIterations, defaultKeyLength)
      .toString('base64');
  }

  return crypto.pbkdf2(this.password, this.salt, defaultIterations, defaultKeyLength, function(err, key) {
    if (err) {
      callback(err);
    }
    return callback(null, key.toString('base64'));
  });
};

var verifyPassword = function(password, salt, callback) {
  var defaultIterations = 10000;
  var defaultKeyLength = 64;

  return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, function(err, key) {
    if (err) {
      callback(err);
    }
    return callback(null, key.toString('base64'));
  });
};

var authenticate = function(password, callback) {
  var _this = this;
  verifyPassword(password, this.salt, function(err, pwdGen) {
    if (err) {
      callback(err);
    }
    if (_this.password === pwdGen) {
      callback(null, true);
    }
    else {
      callback(null, false);
    }
  });
};
