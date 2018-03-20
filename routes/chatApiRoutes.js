var db = require("../models");
var passport = require("../config/passport.js");

module.exports = function (app) {

  app.post("/api/newChat", function (req, res) {
  	intid=parseInt(req.body.FriendId);
    db.Message.create({
      UserId: req.session.passport.user.id,
      FriendId: intid,
      chat_messages: req.body.chat_messages
    }).then(function(data){
      res.json(data); 
    }).catch(function(error){
    	res.json(error);
    });
  });

  app.post("/api/pushChat", function(req, res) {

    var myChats;
    var theirChats;

    var myUserId=req.session.passport.user.id;

    var theirId=req.body.FriendId;

    db.Match.findOne({
      where:{
        UserId: myUserId
      }
      }).then(function(results2){
        myChats=results2.dataValues.myChats;
        if(myChats===null)
          myChats=theirId;
        else{
          var myArray=results2.dataValues.myChats.split(",");
            if(myArray.indexOf(theirId)!==-1){
              res.end();
            }
            else
              myChats+=","+theirId;
        }
  
        db.Match.update({
            myChats: myChats
          }, {
            where: {
              UserId: myUserId
            }
        });    

        db.Match.findOne({
            where:{
              UserId: theirId
            }
          }).then(function(results3){
            theirChats=results3.dataValues.myChats;
          if(theirChats===null)
            theirChats=myUserId;
          else{
            var Array2=results3.dataValues.myChats.split(",");
                if(theirChats.indexOf(myUserId)!==-1){
                  res.end();
                }
                else
                  theirChats+=","+myUserId;
          }
        
          db.Match.update({
              myChats: theirChats
            }, {
              where: {
                UserId: theirId
              }
            });

        });
    });
  });
//ends api

    app.post("/api/oldChat", function (req, res) {
    var intid=parseInt(req.body.FriendId);

    db.Message.findAll({
      where:{
        $or: [
          {
            $and: [{UserId: req.session.passport.user.id}, {FriendId: intid}]
          },
          {
            $and: [{FriendId: req.session.passport.user.id}, {UserId: intid}]
          }
        ]
      },
      order: [['createdAt','ASC']]
    }).then(function(data){
      res.json(data); 
    }).catch(function(error){
      res.json(error);
    });
  });

  app.get("/api/myId", function(req,res){
      var myId=req.session.passport.user.id;
      var intid=parseInt(req.body.FriendId);
      var randoObject={
        myId:myId
      };

      res.json(randoObject);

  });

};
