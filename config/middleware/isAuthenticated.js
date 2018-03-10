module.exports = function(req, res, next) {
	if(req.user)
		return next();
	else
		// Should redirect user to the home page (login page)
		return res.redirect("/test-login");
}