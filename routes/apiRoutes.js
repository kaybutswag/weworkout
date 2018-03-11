var db = require("../models");
var passport = require("../config/passport.js")

module.exports = function(app) {

  // GET route for getting all of the posts
  app.post("/api/test-new-user", function(req, res, next) {
    var newEmail = req.body.email;
    var newPassword = req.body.password;
    var newLatitude = req.body.latitude;
    var newLongitude = req.body.longitude;

    if(newLatitude === "")
      newLatitude = null;
    if(newLongitude === "")
      newLongitude = null;

    db.User.create({
      email: newEmail,
      password: newPassword,
      latitude: newLatitude,
      longitude: newLongitude
    }).then(function() {
      req.login({email: newEmail}, function(err){
        if(err)
          res.json(err);
        else
          res.end();
      });
    }).catch(function(error){
      res.json(error); 
    });
  });

  app.post("/api/test-login-user", function(req, res, next) {
    passport.authenticate("local", function(error, user, info){
      if(error)
        return res.json("error");
      else if (user === false){
        return res.json(info);
      }
      else {
        req.login(user, function(err){
          if(err)
            return next(err);
          else
            return res.json(info);
        });
      }
    })(req, res, next);
  });

  app.put("/api/update-location", function(req, res) {
    db.User.update({
      latitude: req.body.latitude,
      longitude: req.body.longitude
    }, {
      where: {
        email: req.user.email
      }
    }).then(function(response){
      console.log("updated location");
      res.end();
    });
  });

  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/test-login");
  });
  
};