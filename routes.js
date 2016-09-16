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

	app.get("/history", isLoggedIn, function(req, res){
		res.sendFile(__dirname + "/pages/history.html")
	});

	app.get("/leaderboard", isLoggedIn, function(req, res){
		res.sendFile(__dirname + '/pages/leaderboard.html')
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
		User.findOne({"google.id": req.user.google.id}, "attempts", function(err, person){
			if (err) return console.log(err);
			console.log("high score: " + person.getHighScore());
			res.send({email: req.user.google.email, score: person.getHighScore()})
		})
	});

	app.get("/get/userHistory", isLoggedIn, function(req, res){
		User.findOne({"google.id": req.user.google.id}, "attempts", function(err, person){
			if (err) return console.log(err);
			res.send(person.attempts)
		})
	});

	app.get("/get/leaderboardEntries", isLoggedIn, function(req, res){
		User.find({}, "attempts google", function(err, docs){
			for (var i = docs.length - 1; i >= 0; i--) {
				if (docs[i].google.id == req.user.google.id) {
					docs[i].google.name = "Me"
				}
				console.log(docs[i].getHighScore())
				docs[i].score = docs[i].getHighScore();
			}
			res.send(docs);
		})
	});

	app.post("/post/userDone", isLoggedIn, function(req, res){
		console.log(req.body.questionsAttempted);
		User.findOneAndUpdate({"google.id": req.user.google.id}, 
			{
				$set: {"score": req.body.score}, 
				$push: {"attempts": {
					score: req.body.score, attempted: req.body.questionsAttempted
				}}
			}, 
			function(err, user){
				if (err) return console.err(err);
				res.send(200)
			});
	})
};

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/auth/google")
}




