var db = require("../models");
var passport = require("../config/passport.js");
var intid;
var myId;

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

    myId=req.session.passport.user.id;

    intid=parseInt(req.body.FriendId);

    db.Message.findAll({
      where:{
        $or: [
          {
            $and: [{UserId: myId}, {FriendId: intid}]
          },
          {
            $and: [{FriendId: myId}, {UserId: intid}]
          }
        ]
      }
    }).then(function(results){
      if(results !== null){
        console.log("not null")
        res.end();
      }
      else
        console.log("null")
        db.Match.findOne({
        where:{
          UserId: myId
        }
        }).then(function(results2){
          if(results2.dataValues.myChats!==null){
            myChats=results2.dataValues.myChats+","+req.body.FriendId;
          }
          else {
            myChats=req.body.FriendId;
          }

        
        db.Match.update({
            myChats: myChats
          }, {
            where: {
              UserId: myId
            }
          });    

          db.Match.findOne({
            where:{
              UserId: intid
            }
          }).then(function(results3){
            if(results3.dataValues.myChats!==null){
              theirChats=results3.dataValues.myChats+","+myId;
            }
            else {
              theirChats=myId;
            }

            
          db.Match.update({
              myChats: theirChats
            }, {
              where: {
                UserId: intid
              }
            });

          });


  });
  //end then
  });
});
//ends api

    app.post("/api/oldChat", function (req, res) {
    var intid=parseInt(req.body.FriendId);
    console.log(intid);

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
      myId=req.session.passport.user.id;
      intid=parseInt(req.body.FriendId);
      var randoObject={
        myId:myId
      };

      res.json(randoObject);

  });

};
