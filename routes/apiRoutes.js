var db = require("../models");
var passport = require("../config/passport.js")

//new user api
module.exports = function(app) {

  var maxdistance;

  app.post("/api/new-user", function(req, res, next) {
    var lastid;
    var newEmail = req.body.email;
    var newPassword = req.body.password;
    var newLatitude = req.body.latitude;
    var newLongitude = req.body.longitude;

    db.User.create({
      email: newEmail,
      password: newPassword,
      latitude: newLatitude,
      longitude: newLongitude
    }).then(function(result) {
      db.Match.create({
        email: newEmail,
        UserId: result.id
      });

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

//authenticates returning user
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

//sends form data to database
  app.post("/api/user-form", function(req, res) {
    var userId;

    db.User.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(response){
      db.Form.upsert({
        email: req.user.email,
        name: req.body.name,
        gender: req.body.gender,
        dob: req.body.dob,
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
        bio: req.body.bio,
        UserId: response.dataValues.id
      }).then(function(){
        res.json("next");
      }).catch(function(error){
        console.log(error);
        res.json("error"); 
      });  
    });
  });

//
  app.post("/api/user-preferences", function(req, res) {
    db.Form.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(response){
      res.json(response);
    });
  });


//updates login location
  app.put("/api/update-location", function(req, res) {
    db.User.update({
      latitude: req.body.latitude,
      longitude: req.body.longitude
    }, {
      where: {
        email: req.user.email
      }
    }).then(function(response){
      res.end();
    });
  });

//this will grab pictures. probably changing
  app.post("/api/get-prof-pic", function(req, res){
    db.Form.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(data){
      res.json(data.img);
    });
  });

  //gets user's age
  app.post("/api/get-age", function(req, res){
    db.Form.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(data){
      var userDOB = new Date(data.dataValues.dob);
      userDOB = userDOB.getFullYear() + "-" + (userDOB.getMonth() + 1) + "-" + (userDOB.getDate() + 1);
      res.json(userDOB);
    });
  });

  app.post("/api/get-default-filter", function(req, res){
    db.Form.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(data){
      var sportsPreferences = [];
      var sportsArray = ["weightlift", "run", "walk", "swim", "surf", "bike", "yoga", "pilates", "cardio", "dance", "rock", "gymnastics", "bowl", 
      "rowing", "tennis", "baseball", "basketball", "football", "soccer", "rugby", "volleyball", "golf", "hockey", "ice", "skateboard"];
      for(var i = 0; i < sportsArray.length; i++) {
        if(data.dataValues[sportsArray[i]] === true) {
          sportsPreferences.push(sportsArray[i]);
        }
      }
      res.json(sportsPreferences);
    });
  })

  //our match function
  app.post("/api/filter-judgees", function(req, res){
    var sportsArray = [];

    for(var i = 0; i < req.body.sports.length; i++) {
      var sport = req.body.sports[i];
      var newSport = {};
      newSport[sport] = 1;
      sportsArray.push(newSport);
    }   

    maxdistance = req.body.miles;

    db.Form.findAll({
      where: {
        $or: sportsArray,
        gender: {
          $in: req.body.genderselect
        },
        email: {
          $not: req.user.email
        },
        where: db.sequelize.where(db.sequelize.fn('TIMESTAMPDIFF', db.sequelize.literal("year"), db.sequelize.col("dob"), db.sequelize.fn('NOW')), "<=", req.body.maxAge),
        $and: {
          where: db.sequelize.where(db.sequelize.fn('TIMESTAMPDIFF', db.sequelize.literal("year"), db.sequelize.col("dob"), db.sequelize.fn('NOW')), ">=", req.body.minAge)
        }
      },
      include:[db.User]
    }).then(function(data){
      filterResults(req, data, maxdistance);
    });
  });

  function filterResults(req, data, maxdistance){
    var mylong = req.session.passport.user.longitude;
    var mylat = req.session.passport.user.latitude;
    console.log("mylong: " + mylong);
    console.log("mylat: " + mylat);
    var userlong;
    var userlat;
    var promises = [];

    var nearOptions=[];
    for(var i = 0;i<data.length;i++){
      var promise = db.User.findOne({
        where: {
          email: data[i].email
        }
      }).then(function(userdata){
        userlong=userdata.longitude;
        userlat=userdata.latitude;

        if(getDistance(userlat,userlong,mylat,mylong) <= maxdistance)
          nearOptions.push(userdata);
      });
      promises.push(promise);
    }

    Promise.all(promises).then(function(){
      console.log(nearOptions);
      return nearOptions});
  }

  function getDistance(latitude1,longitude1,latitude2,longitude2) {
    var p = 0.017453292519943295;    //This is  Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((latitude2 - latitude1) * p)/2 +
            c(latitude1 * p) * c(latitude2 * p) *
            (1 - c((longitude2 - longitude1) * p))/2;
    var R = 6371; //  Earth distance in km so it will return the distance in km
    var dist = 2 * R * Math.asin(Math.sqrt(a));
    dist = dist/1.60934 ;
    return dist;
  }

  function removeMatches(lessUsers){
    var myLikes=[];
    var showOptions=[];
    db.Match.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(mydata){
        myLikes=mydata.split(",");

        for(var i=0;i<lessUsers.length;i++){
          if(lessUsers.UserId.indexOf(myLikes)===-1){
            showOptions.push(lessUsers[i]);
          }
        }
        return showOptions;
    });

  }
//this will push id into likes
  app.put("/api/change-likes", function(req, res) {
    var myLikes;
    var theirLikes;
    var myId=req.session.passport.user.dataValues.id;
    var theirId = req.body.likeId;
    var myEmail = req.user.email;

    db.Match.findOne({
      where: {
        email: myEmail
      }
    }).then(function(results){
      myLikes = results.myLikes;
      if(myLikes === null)
        myLikes = theirId;
      else
        myLikes += "," + theirId;
      
      db.Match.update({
        myLikes: myLikes
      }, {
        where: {
          email: myEmail
        }
      });    
    });

    db.Match.findOne({
      where:{
        UserId: theirId
      }
    }).then(function(results2){
      theirLikes=results2.myLikes.split(",");
      if(myId.indexOf(theirLikes)!==-1){             
        db.Match.findOne({
          where: {
            email: myEmail
          }
        }).then(function(myProfile){
          var existingMatches = myProfile.myMatches;
          if(existingMatches === null)
            existingMatches = req.body.likeId;
          else
            existingMatches += "," + theirId;
          db.Match.update({
            myMatches: existingMatches
          }, {
            where: {
              email: myEmail
            }
          });
        });

        db.Match.findOne({
          where: {
            UserId: theirId
          }
        }).then(function(theirProfile){
          var existingMatches = theirProfile.myMatches;
          if(existingMatches === null)
            existingMatches = myId;
          else
            existingMatches += "," + myId;
          db.Match.update({
            myMatches: existingMatches
          }, {
            where: {
              UserId: theirId
            }
          });
        });
      }
    
    res.end();

    });
  });

//logout but saves function

  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/index");
  });
  
};