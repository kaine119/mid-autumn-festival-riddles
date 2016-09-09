var mongoose = require('mongoose');

var riddleSchema = mongoose.Schema({
	question: {type: String, required: true},
	options: [ {text: String, correct: Boolean} ]
		
}, {collection: "riddles"});

riddleSchema.statics.random = function(entriesToExclude, callback){
	this.count(function(err, count){
		if (err) {return callback(err);}
		var randomCount = Math.floor(Math.random() * count);
		console.log(randomCount);
		this.findOne({_id: {$nin: entriesToExclude}}).skip(randomCount).exec(callback);
	}.bind(this));
}

var Riddle = mongoose.model("Riddle", riddleSchema);

module.exports = Riddle;
