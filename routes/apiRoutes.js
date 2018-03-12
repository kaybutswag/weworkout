var db = require("../models");
var passport = require("../config/passport.js")

module.exports = function(app) {

  // GET route for getting all of the posts
  app.post("/api/test-new-user", function(req, res, next) {
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
      lastid=result.dataValues.id;
      runMatch(lastid);
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

function runMatch(lastid){
db.Match.create({
      mainid: lastid
    }).DB.Form.create({
      mainid: lastid
    }).catch(function(error){
      res.json(error); 
    });
  }

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

app.post("/api/user-form", function(req, res, next) {
    var newName = req.body.name;
    var newGender = req.body.gender;
    var newAge = req.body.age;
    var newImg = req.body.img;
    var newLocation = req.body.primaryLocation;
    var newWeightlift = req.body.weightlift;
    var newRun = req.body.run;
    var newSwim = req.body.swim;
    var newSurf = req.body.surf;
    var newBike = req.body.bike;
    var newYoga = req.body.yoga;
    var newPilates = req.body.pilates;
    var newCardio = req.body.cardio;
    var newDance = req.body.dance;
    var newRock = req.body.rock;
    var newGym = req.body.gymnastics;
    var newBowl = req.body.bowl;
    var newRowing = req.body.rowing;
    var newTennis = req.body.tennis;
    var newBaseball = req.body.baseball;
    var newBasketball = req.body.basketball;
    var newFootball = req.body.football;
    var newSoccer = req.body.soccer;
    var newRugby = req.body.rugby
    var newVolleyball = req.body.volleyball;
    var newGolf = req.body.golf;
    var newHockey = req.body.hockey;
    var newIce= req.body.ice;
    var newSkateboard = req.body.skateboard;
    var newBio = req.body.bio;

    db.Form.create({
      name: newName,
      gender: newGender,
      age: newAge,
      img: newImg,
      primaryLocation:newLocation,
      weightlift:newWeightlift,
      run:newRun,
      swim: newSwim,
      surf: newSurf,
      bike: newBike,
      yoga: newYoga,
      pilates:newPilates,
      cardio:newCardio,
      dance: newDance,
      rock: newRock,
      gymnastics: newGym,
      bowl: newBowl,
      rowing: newRowing,
      tennis: newTennis,
      baseball: newBaseball,
      basketball: newBasketball,
      football: newFootball,
      soccer: newSoccer,
      rugby: newRugby,
      volleyball:newVolleyball,
      golf:newGolf,
      hockey: newHockey,
      ice: newIce,
      skateboard:newSkateboard,
      bio:newBio
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