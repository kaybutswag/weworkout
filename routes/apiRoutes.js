var db = require("../models");
var passport = require("../config/passport.js")

module.exports = function(app) {

  // GET route for getting all of the posts
  app.post("/api/test-new-user", function(req, res) {
    var newEmail = req.body.email;
    var newPassword = req.body.password;

    db.User.create({
      email: newEmail,
      password: newPassword
    }).then(function() {
      res.end();
    }).catch(function(error){
      res.json(error); 
    });
  });

  app.post("/api/test-login-user", passport.authenticate("local"), function(req, res) {
    res.json("/test-success");
  });

  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/test-login");
  });
  
};