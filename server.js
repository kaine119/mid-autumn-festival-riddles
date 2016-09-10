var express = require('express');
var app = express();
var port = process.env.PORT || 3000

// requires
var mongoose = require('mongoose');
var routes = require("./routes");
var Riddle = require('./models/Riddle');
var bodyParser = require("body-parser");
var session = require("express-session");

var passport = require("passport");

var morgan = require("morgan");
// app.use(morgan("dev"));

mongoose.Promise = global.Promise

var dbconfig = require("./config/database.js");
mongoose.connect(dbconfig.url);

require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({ secret: "dhsicc2016" }));
app.use(passport.initialize());
app.use(passport.session());

require("./routes")(app, passport)

app.listen(port, function () {
	console.log('Listening on http://localhost:' + port);
});
