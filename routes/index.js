var express = require('express');
var router = express.Router();
var Announce = require('../models/announce');

router.get('/', ensureAuthenticated, function (req, res) {
	res.render('index');
})

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		next();
	}else {
		res.redirect('/users/login');
	}
}

router.get('/announce', function (req, res) {
	Announce.find().sort({'uploadtime': 'descending'}).exec(function (err, results) {
		if (err) throw err;
		res.render('announce',{data: results})
	});
})

module.exports = router;