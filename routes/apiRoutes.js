var db = require("../models");
var passport = require("../config/passport.js")

module.exports = function(app) {

  // GET route for getting all of the posts
  app.post("/api/new-user", function(req, res, next) {
    var lastid;
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
    }).then(function(result) {
      runMatch(newEmail);
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

  function runMatch(newEmail) {

    db.Match.create({
      email: newEmail
    }).catch(function(error){
      res.json(error);
    });

    db.Form.create({
      email: newEmail
    }).catch(function(error){
      res.json(error); 
    });
  }

  app.post("/api/login-user", function(req, res, next) {
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

app.post("/api/user-form", function(req, res, next) {
    db.Form.upsert({
      email: req.user.email,
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      img: req.body.img,
      primaryLocation: req.body.primaryLocation,
      weightlift: req.body.weightlift,
      run: req.body.run,
      walk: req.body.walk,
      swim: req.body.swim,
      surf: req.body.surf,
      bike: req.body.bike,
      yoga: req.body.yoga,
      pilates: req.body.pilates,
      cardio: req.body.cardio,
      dance: req.body.dance,
      rock: req.body.rock,
      gymnastics: req.body.gymnastics,
      bowl: req.body.bowl,
      rowing: req.body.rowing,
      tennis: req.body.tennis,
      baseball: req.body.baseball,
      basketball: req.body.basketball,
      football: req.body.football,
      soccer: req.body.soccer,
      rugby: req.body.rugby,
      volleyball: req.body.volleyball,
      golf: req.body.golf,
      hockey: req.body.hockey,
      ice: req.body.ice,
      skateboard: req.body.skateboard,
      bio: req.body.bio
    }).catch(function(error){
      res.json(error); 
    });  
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

//need an update function for form


  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/index");
  });
  
};