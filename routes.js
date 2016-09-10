var express = require('express');
var Riddle = require('./models/Riddle');
var User = require('./models/User');
var mongoose = require("mongoose")

module.exports = function(app, passport) {
	app.post('/post/riddle', function(req, res){
		var riddlesToExclude = []
		for (var i = req.body.pastRiddles.length - 1; i >= 0; i--) {
			console.log(mongoose.Types.ObjectId(req.body.pastRiddles[i]))
			riddlesToExclude.push( mongoose.Types.ObjectId(req.body.pastRiddles[i]) );
		}
		Riddle.find({_id: {$nin: riddlesToExclude}}, function(err, docs){
			if (err) return console.log(err);
			var randomIndex = Math.floor(Math.random() * docs.length);
			res.send(docs[randomIndex])
		});
	});

	app.get("/", isLoggedIn, function(req, res){
		res.sendFile(__dirname + "/pages/index.html")
	});

	app.get("/auth/google", passport.authenticate('google', 
		{scope: ['profile', 'email'], 
		 accessType: "offline",
		 approvalPrompt: "auto"}));

	app.get('/auth/google/callback', 
		passport.authenticate("google", {
			successRedirect: '/',
			failureRedirect: '/'
		}));

	app.get("/get/userDetails", isLoggedIn, function(req, res){
		res.send(req.user);
	});

	app.post("/post/userDone", isLoggedIn, function(req, res){
		User.findOneAndUpdate({"google.id": req.user.google.id}, {$set: {score: req.body.score}}, function(err, user){
			if (err) return console.err(err);
			res.send(200)
		})
	})
};

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/auth/google")
}




