var mongoose = require('mongoose');
var Riddle = require("./Riddle");

var userSchema = mongoose.Schema({
	score: Number,
	user_id: {type: String,
		default: function(){
			return (Math.random()).toString(36).substr(2, 6);
		}
	},
	cleared: {type: Boolean, default: false}
}, {collection: "users"});

var User = mongoose.model("User", userSchema)

module.exports = User;
