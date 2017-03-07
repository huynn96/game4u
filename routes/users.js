var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var configAuth = require('../config/config');

router.get('/login', ensureAuthenticated, function (req, res) {
	res.render('login');
})

router.get('/register', ensureAuthenticated, function (req, res) {
	res.render('register');
})

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		res.redirect('/');
	}else {
		next();
	}
}

router.post('/register',function (req, res) {
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var email = req.body.email;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Password is not match').equals(req.body.password);

	var errors = req.validationErrors();
	if (errors){
		res.render('register',{
			errors: errors
		});
	}else{
		var newUser = new User({
			name: name,
			username: username,
			email: email,
			password: password
		})

		User.createUser(newUser, function (err, user) {
			if (err) throw err;
			console.log(user);
		})

		req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/users/login');
	}

})

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      User.comparePassword(password, user.password, function (err, isMatch) {
      	if (err) throw err;
      	if (!isMatch) {
        	return done(null, false, { message: 'Incorrect password.' });
      	}
      		return done(null, user);
      })
      
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
  		console.log(accessToken);
  		console.log(profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
   passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }));

router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/users/login' }));

router.get('/logout',function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;