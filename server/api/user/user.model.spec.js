'use strict';

import app from '../..';
import User from './user.model';
var user;
var genUser = function() {
  user = new User({
    provider: 'local',
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });
  return user;
};

describe('User Model', function() {
  before(function() {
    // Clear users before testing
    return User.removeAsync();
  });

  beforeEach(function() {
    genUser();
  });

  afterEach(function() {
    return User.removeAsync();
  });

  it('should begin with no users', function() {
    return User.find({where: {email: 'test@example.com'}}).should
      .eventually.have.length(0);
  });

  it('should fail when saving a duplicate user', function() {
    return User.create(user)
      .then(function() {
        var userDup = genUser();
        return User.create(userDup);
      }).should.be.rejected;
  });

  describe('#email', function() {
    it('should fail when saving without an email', function() {
      user.email = '';
      return User.create(user).should.be.rejected;
    });
  });

  describe('#password', function() {

    it('should authenticate user if valid', function() {
      User.validatePassword('password123').should.be.true;
    });

    it('should not authenticate user if invalid', function() {
      User.validPassword('bleh').should.not.be.true;
    });

  });

});
