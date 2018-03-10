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
			if(!dbUser)
				return done(null, false,
				{
					message: "Sorry. We could not find that user."
				});
			else if(dbUser.password !== password)
				return done(null, false, 
				{
					message: "The password you entered is incorrect."
				});
			else
				return done(null, dbUser);
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