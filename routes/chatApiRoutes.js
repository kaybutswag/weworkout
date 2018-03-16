var db = require("../models");
var passport = require("../config/passport.js");

module.exports = function (app) {

  app.post("/api/newChat", function (req, res) {
  	var intid=parseInt(req.body.FriendId);
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
      
      var myId=req.session.passport.user.id;
      var randoObject={
        myId:myId
      };

      res.json(randoObject);

  });

};
