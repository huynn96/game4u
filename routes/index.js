var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated, function (req, res) {
	res.render('index')	;
})

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		next();
	}else {
		res.redirect('/users/login');
	}
}

module.exports = router;