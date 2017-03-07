module.exports = function (app, rooms) {
	var express = require('express');
	var router = express.Router();

	router.get("/", ensureAuthenticated, function(req, res) {
		res.render("caro_roomlist");
	});

	router.get("/:id", ensureAuthenticated, function(req, res) {
		var room_name = findName(req.params.id);
		if (room_name == "NotFoundABCXYZ"){
			res.redirect('/caro');
		}else{
			res.render("caro",{room_name: room_name, room_number: req.params.id});
		}
	});

	function findName(id) {
		for(var i=0;i<rooms.length;i++){
			if (rooms[i].number == id){
				return rooms[i].name;
			}
		}
		return "NotFoundABCXYZ";
	}

	function ensureAuthenticated(req, res, next){
		if (req.isAuthenticated()){
			next();
		}else {
			res.redirect('/users/login');
		}
	}
	app.use('/caro', router);
};