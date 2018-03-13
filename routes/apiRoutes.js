var db = require("../models");
var passport = require("../config/passport.js")

//new user api
module.exports = function(app) {

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
      runMatch(newEmail, result.id);
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

//creates email primary key
  function runMatch(newEmail, id) {

    db.Match.create({
      email: newEmail,
      UserId: id
    });

    db.Form.create({
      email: newEmail,
      UserId: id
    });
  }

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
      console.log("updated location");
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

//our match function
app.post("/api/filter-judgees", function(req, res){
    var sportsArray = [];

    for(var i = 0; i < req.body.sports.length; i++) {
      var sport = req.body.sports[i];
      var newSport = {sport: 1};
      sportsArray.push(newSport);
    }   


    db.Form.findAll({
      where: {
        $or: sportsArray,
        gender: {
          $in: req.body.gender
        }
      },
      include:[db.User]
    }).then(function(data){
      filterResults(data,req.body.miles);
    });
  });

function filterResults(data,maxdistance){

  var nearOptions=[];
  for(var i=0;i<data.length;i++){
    db.Match.findOne({
      where: {
        email: data[i].email
      }
    }).then(function(userdata){
        var userlong=userdata.longitude;
        var userlat=userdata.latitude;

        var mylong=req.session.passport.user.dataValues.longitude;
        var mylat=req.session.passport.user.dataValues.latitude;

        if (getDistance(userlat,userlong,mylat,mylong)<=maxdistance){
            nearOptions.push(data[i]);
        }
    })
  }

  var possibleMatches = removeMatches(nearOptions);
  res.json(possibleMatches);
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
    console.log(dist + " miles")
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

    db.Match.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(results){
      myLikes = results.myLikes;
      if(myLikes === null)
        myLikes = req.body.likeId;
      else
        myLikes += "," + req.body.likeId;
      
      db.Match.update({
        myLikes: myLikes
      }, {
        where: {
          email: req.user.email
        }
      }).then(function(response){
        res.end();
      })    
    });

    db.Match.findOne({
      where:{
        UserId:req.body.likeId
      }
    }).then(function(results2){
      theirLikes=results2.myLikes.split(",");
      if(myId.indexOf(theirLikes)!==-1){

        //this will need to update match strings
      //   db.Match.update({
      //   myMatches: myLikes
      // }, {
      //   where: {
      //     email: req.user.email
      //   }
      // }).then(function(response){
      //   res.end();
      // }) 
      }
    })
  });


//logout but saves function

  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/index");
  });
  
};