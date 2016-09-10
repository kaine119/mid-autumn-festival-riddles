var mongoose = require('mongoose');

var riddleSchema = mongoose.Schema({
	question: {type: String, required: true},
	options: [ {text: String, correct: Boolean} ]
		
}, {collection: "riddles"});

var Riddle = mongoose.model("Riddle", riddleSchema);

module.exports = Riddle;
