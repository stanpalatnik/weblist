import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import Models from '../../api/index';

function localAuthenticate(User, email, password, done) {
  Models.User.find({
    where: {email: email}
  })
    .then(function (user) {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      user.authenticate(password, function (authError, authenticated) {
        if (authError) {
          console.log("Auth error:" + authError);
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, {
            message: 'This password is not correct.'
          });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(function (err) {
      return done(err);
    });
}

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function (email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
};
