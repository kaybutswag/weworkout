var db = require("../models");
var passport = require("../config/passport.js");

//new user api
module.exports = function(app) {

  var maxdistance;
  var myLatitude;
  var myLongitude;

  app.post("/api/new-user", function(req, res, next) {
    var lastid;
    var newEmail = req.body.email;
    var newPassword = req.body.password;
    myLatitude = req.body.latitude;
    myLongitude = req.body.longitude;

    db.User.create({
      email: newEmail,
      password: newPassword,
      latitude: myLatitude,
      longitude: myLongitude
    }).then(function(result) {
      db.Match.create({
        email: newEmail,
        UserId: result.id
      });
      res.json("success");
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
      userId = response.dataValues.id;

      db.Form.upsert({
        email: req.user.email,
        name: req.body.name,
        gender: req.body.gender,
        dob: req.body.dob,
        img: req.body.img,
        fileName: req.body.fileName,
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
        UserId: userId
      }).then(function(){
        res.json("next");
      }).catch(function(error){
        console.log(error);
        res.json("error"); 
      });

    });  
  });

//
  app.get("/api/user-preferences", function(req, res) {
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
    myLatitude = req.body.latitude;
    myLongitude = req.body.longitude;
    
    if(myLatitude !== 'a' && myLongitude !== 'a') {
      db.User.update({
        latitude: myLatitude,
        longitude: myLongitude
      }, {
        where: {
          email: req.user.email
        }
      }).then(function(response){
        res.end();
      });
    }
    else {
      db.User.findOne({
        where: {
          email: req.user.email
        }
      }).then(function(response){
        myLatitude = response.dataValues.latitude;
        myLongitude = response.dataValues.longitude;
        res.end();
      });
    }
  });

  //gets user's age
  app.post("/api/get-age", function(req, res){
    db.Form.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(data){
      var userDOB = data.dataValues.dob;
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
  });

  //our match function
  app.post("/api/filter-judgees", function(req, res){
    var sportsArray = [];
    var list1=[];


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
        $and:{
          where: db.sequelize.where(db.sequelize.fn('TIMESTAMPDIFF', db.sequelize.literal("year"), db.sequelize.col("dob"), db.sequelize.fn('NOW')), ">=", req.body.minAge)
      }
    },
      include:[db.User]
    }).then(function(data){
      filterResults(res,req,data,maxdistance)
      });    
  });

  function filterResults(res,req,data,maxdistance){
    var userlong;
    var userlat;

    var promises=[];

    var nearOptions=[];
    for(var i=0;i<data.length;i++){
      var promise=db.User.findOne({
        where: {
          email: data[i].email
        }
      }).then(function(userdata){
          userlong=userdata.longitude;
          userlat=userdata.latitude;

          if (getDistance(userlat,userlong,myLatitude,myLongitude)<=maxdistance)
              nearOptions.push(userdata);
      });
      promises.push(promise);
    }
    
    Promise.all(promises).then(function(){
      removeMatches(res, req, nearOptions)
    });
  }

  function getDistance(latitude1,longitude1,latitude2,longitude2) {
    var radlatitude1 = Math.PI * latitude1 / 180;
    var radlatitude2 = Math.PI * latitude2 / 180;
    var theta = longitude1 - longitude2;
    var radtheta = Math.PI * theta / 180;
    var distance = Math.sin(radlatitude1) * Math.sin(radlatitude2) + Math.cos(radlatitude1) * Math.cos(radlatitude2) * Math.cos(radtheta);
    distance = Math.acos(distance);
    distance = distance * 180 / Math.PI;
    distance = distance * 60 * 1.1515;
    return distance;
  }

  function removeMatches(res, req, lessUsers){
    var myLikes=[];
    var showOptions=[];

    db.Match.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(mydata){
        if(mydata.myLikes !== null)
          myLikes=mydata.myLikes.split(",");

        for(var i=0;i<lessUsers.length;i++){
          if(myLikes.indexOf(lessUsers[i].id.toString())===-1){
            showOptions.push(lessUsers[i]);
          }
        }
        getFormData(res, showOptions);
    });
  }

  function getFormData(res,userdata2) {
    var thisid;
    var cardOptions=[];
    var promises=[];

    for(var i=0;i<userdata2.length;i++){
      thisEmail=userdata2[i].email;

      var promise=db.Form.findOne({
          where: {
          email: thisEmail
        }
      }).then(function(userdata3){
          cardOptions.push(userdata3);
    });

      promises.push(promise);
    }
    
    Promise.all(promises).then(function(){
      res.json(cardOptions);
    });
  }

  //this will push id into likes
  app.put("/api/change-likes", function(req, res) {
    var myLikes;
    var theirLikes;
    var myId = req.session.passport.user.id;
    var theirId = req.body.likeId;
    var myEmail = req.user.email;
    var isMatch = false;

    var myName;
    var theirName;
    var myPhoto;
    var theirPhoto;
    var response = {};

    db.Match.findOne({
      where: {
        email: myEmail
      }
    }).then(function(results){
      myLikes = results.dataValues.myLikes;
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
      if(results2.dataValues.myLikes!==null){
        theirLikes=results2.dataValues.myLikes.split(",");
      }
      else {
        theirLikes=[];
      }

      if(theirLikes.indexOf(myId.toString())!==-1){
        isMatch = true;           
        db.Match.findOne({
          where: {
            email: myEmail
          }
        }).then(function(myProfile){
          var existingMatches = myProfile.dataValues.myMatches;
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
          var existingMatches = theirProfile.dataValues.myMatches;
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

      if(isMatch === true) {
        response.result = "match";
        var promise1 = db.Form.findOne({
          where: {
            email: myEmail
          }
        }).then(function(myInfo){
          myName = myInfo.dataValues.name;
          myPhoto = myInfo.dataValues.img;
          response.myName = myName; 
          response.myPhoto = myPhoto;
        });

        var promise2 = db.Form.findOne({
          where: {
            UserId: theirId
          }
        }).then(function(theirInfo){
          theirName = theirInfo.dataValues.name;
          theirPhoto = theirInfo.dataValues.img;
          response.theirName = theirName;
          response.theirPhoto = theirPhoto;
        });

        Promise.all([promise1, promise2]).then(function() {
          res.json(response);
        });
      }
      else {
        response.result = "no match";
        res.json(response);
      }
    });
  });

  //get matches for page

  app.get("/api/myMatches",function(req,res){
    db.Match.findOne({
      where:{
        UserID:req.session.passport.user.id
      }
    }).then(function(matchdata){
      var chats=matchdata.dataValues.myChats;
      var matches=matchdata.dataValues.myMatches;
      if(matches===null){
        res.send("nada");
      }
      else{
        var arrayOfMatches = matches.split(",");
        var arrayOfChats;
        if(chats !== null)
          arrayOfChats = chats.split(",");
        else 
          arrayOfChats = [];
        var matchNoChat=[];

        for(var i=0;i<arrayOfMatches.length;i++){
          if(arrayOfChats.indexOf(arrayOfMatches[i])===-1)
            matchNoChat.push(arrayOfMatches[i]);
        }
        if(matchNoChat.length===0){
          res.send("nada");
        }
        else{
        pullMatches(res,matchNoChat);
      }
      }
  });

});


function pullMatches(res,matches){

    var MatchCards=[];
    var promises=[];

    for(var i=0;i<matches.length;i++){
      thisMatch=matches[i];

      var promise=db.Form.findOne({
          where: {
          UserId: thisMatch
        }
      }).then(function(matchforms){
          MatchCards.push(matchforms);
    });

      promises.push(promise);
    }
    
    Promise.all(promises).then(function(){
      res.json(MatchCards);
    });
  }


  app.get("/api/myChats",function(req,res){
    db.Match.findOne({
      where:{
        UserId:req.session.passport.user.id
      }
    }).then(function(matchdata){
      var chats=matchdata.dataValues.myChats;
      if(chats===null){
        res.send("nochats");
      }
      else{
        var arrayOfChats = chats.split(",");

        pullChats(res,arrayOfChats);
      }
  });

});


function pullChats(res,chats){

    var ChatCards=[];
    var promises=[];

    for(var i=0;i<chats.length;i++){
      thisChat=chats[i];

      var promise=db.Form.findOne({
        where: {
          UserId: thisChat
        }
      }).then(function(chatforms){
          ChatCards.push(chatforms);
    });

      promises.push(promise);
    }
    
    Promise.all(promises).then(function(){
      res.json(ChatCards);
    });
  }

  app.post("/api/getUserInfo", function(req, res){
    db.Form.findOne({
      where: {
        UserId: req.body.id 
      }
    }).then(function(userInfo){
      res.json(userInfo);
    });
  });


//logout but saves function

  app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/index");
  });
  
};