var express = require('express');
var app = express();
var port = process.env.PORT || 3001

// requires
var mongoose = require('mongoose');
var routes = require("./routes");
var Riddle = require('./models/Riddle');
var bodyParser = require("body-parser")

mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost/riddles");

app.use(bodyParser.json());

app.use(express.static('public'));

app.use(routes)

app.listen(port, function () {
	console.log('Listening on http://localhost:3000');
});
