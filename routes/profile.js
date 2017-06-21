var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', ensureAuthenticated, function (req, res) {
	res.render('profile');
})

router.post('/',ensureAuthenticated, function (req, res) {
	var id = req.body.id;
	var name = req.body.name;
	var oldpassword = req.body.oldpassword;
	var newpassword = req.body.newpassword;
	var newpassword2 = req.body.newpassword2;
	var email = req.body.email;
	var photoPic = req.body.photo;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();

	User.getUserById(id, function (err, user) {
		if (oldpassword){
			req.checkBody('newpassword2', 'Password is not match').equals(req.body.newpassword);
			User.comparePassword(oldpassword, user.password, function (err, isMatch) {
		      	if (err) throw err;
		      	if (!isMatch) {
		        	req.checkBody('newpassword', 'Incorrect password').isEmpty();
		      	}

		      	var errors = req.validationErrors();
				if (errors){
					res.render('profile',{
						errors: errors
					});
				}else{
					user.name = name;
					user.email = email;
					user.password = newpassword;
					user.photoPic = photoPic;

					User.createUser(user, function (err, user) {
						if (err) throw err;
					})

					req.flash('success_msg', 'You are edit profile success');
					res.redirect('/profile');
				}
		    })
		}else {
				var errors = req.validationErrors();
				if (errors){
					res.render('profile',{
						errors: errors
					});
				}else{
					user.name = name;
					user.email = email;
					user.photoPic = photoPic;

					user.save();

					req.flash('success_msg', 'You are edit profile success');
					res.redirect('/profile');
				}
		}
	})
})

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		next();
	}else {
		res.redirect('/users/login');
	}
}

module.exports = router;