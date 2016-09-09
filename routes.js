var express = require('express');
var Riddle = require('./models/Riddle');
var User = require('./models/User');
var mongoose = require("mongoose")

var router = express.Router();

router.post('/post/riddle', function(req, res){
	Riddle.random([], function(err, riddle){
		res.send(riddle);
		console.log(riddle);
	});
});

router.get("/admin/:id", function(req, res){
	if (req.params.id == "DHSICC2016") {
		res.sendFile(__dirname + "/public/admin.html")
	} else {
		res.send(403)
	}
});

router.get("/admin(.html)", function(req, res){
	res.send(403);
});

router.post("/post/userDone", function(req, res){
	(new User({score: req.body.score})).save(function(err, newUser){
		if (err) return console.err(err);
		res.send(newUser.user_id)
	})
});

router.get("/get/users", function(req, res){
	User.find({}, function(err, users){
		res.send(users)
	})
});

router.post("/post/clearUser", function(req, res){
	User.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.id)}, {$set: {cleared: true}}, function(err, doc){
		if (err) {
			return console.err(err);
		}
		res.send(200)
	})
});

router.post("/post/")

module.exports = router;
