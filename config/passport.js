var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var db = require("../models");

passport.use(new LocalStrategy(
	{
		usernameField: "email"
	},
	function(email, password, done) {
		db.User.findOne({
			where: {
				email: email
			}
		}).then(function(dbUser){
			if(!dbUser) {
				return done(null, false, "user");
			}
			else if(dbUser.password !== password)
				return done(null, false, "password");
			else {
				return done(null, dbUser, "correct");
			}
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(object, done) {
	done(null, object);
});

module.exports = passport;