var mongoose = require('mongoose');
var Riddle = require("./Riddle");

var userSchema = mongoose.Schema({
	score: Number,
	user_id: {type: String,
		default: function(){
			return (Math.random()).toString(36).substr(2, 6);
		}
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	attempts: [{
		score: Number,
		attempted: [{
			guess: Boolean,
			options: [ {text: String, correct: Boolean} ],
			question: String,
			questionNumber: Number,
			_id: String
		}]
	}]
}, {collection: "users"});

userSchema.methods.getHighScore = function(){
	var highScore = 0;
	console.log(this);
	if (this.attempts != undefined) {
		console.log("attempts is there")
		for (var i = this.attempts.length - 1; i >= 0; i--) {
			if (this.attempts[i].score > highScore) {
				highScore = this.attempts[i].score;
			}
		};
		return highScore;
	} else {
		return 0
	}
	
}

var User = mongoose.model("User", userSchema)

module.exports = User;
