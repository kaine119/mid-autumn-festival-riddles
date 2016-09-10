var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

var User = require("../models/User");

var oAuthConfig = require("./auth.js");

module.exports = function(passport){
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		})
	})


	// ================
	// GOOGLE
	// ================
	passport.use(new GoogleStrategy(oAuthConfig,
		function(token, refreshToken, profile, done) {

			process.nextTick(function() {

				User.findOne({'google.id': profile.id}, function(err, user) {
					if (err) return done(err);

					if (user) {
						// User is found, log them in
						return done(null, user);
					}
					else {
						// User not in database, add them in
						var newUser = new User();
						newUser.google.id    = profile.id;
						newUser.google.token = token;
						newUser.google.name  = profile.displayName;
						newUser.google.email = profile.emails[0].value; // First email


						// Save user
						newUser.save(function(err) {
							if (err) return done(err);
							return done(null, newUser);
						})
					}
				})

			})

		}))
};