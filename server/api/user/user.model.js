'use strict';

var crypto = require('crypto');
var validator = require('validator');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name    : DataTypes.STRING,
    username: DataTypes.STRING,
    email   : { type: DataTypes.STRING, allowNull: false, unique: true },
    role    : { type: DataTypes.STRING, defaultValue: 'user' },
    password: { type: DataTypes.STRING, allowNull: false },
    salt    : { type: DataTypes.STRING },
    provider: { type: DataTypes.STRING, defaultValue: 'local' }
  }, {
    classMethods: {
      associate: function(models) {
        //User.hasMany(models.Thing)
      }
    },
    paranoid: false,
    instanceMethods: {
      verifyPassword: authenticate,
      encryptPassword: encryptPassword
    }
  });

  User.hook('beforeValidate', function(user, options) {
    if(!validator.isEmail(user.email)){
      return sequelize.Promise.reject('Validation Error: Invalid email');
    }

    if(!validator.isAlphanumeric(user.password) || !validator.isLength(user.password, 6)){
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


/**
 * Virtuals
 */

/* Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });
*/

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
var encryptPassword = function( callback) {
  if (!this.password || !this.salt) {
    return null;
  }

  var defaultIterations = 10000;
  var defaultKeyLength = 64;
  var salt = new Buffer(this.salt, 'base64');

  if (!callback) {
    return crypto.pbkdf2Sync(this.password, salt, defaultIterations, defaultKeyLength)
      .toString('base64');
  }

  return crypto.pbkdf2(this.password, salt, defaultIterations, defaultKeyLength, function(err, key) {
    if (err) {
      callback(err);
    }
    return callback(null, key.toString('base64'));
  });
};

var authenticate = function(password, callback) {
  if (!callback) {
    return this.password === encryptPassword(password);
  }

  var _this = this;
  encryptPassword(password, function(err, pwdGen) {
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
