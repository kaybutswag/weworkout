var db = require("../models");
var passport = require("../config/passport.js");

module.exports = function (app) {

  app.post("/api/newChat", function (req, res) {
  	console.log("hit here");
  	console.log(req.body);
  	var intid=parseInt(req.body.FriendId);
  	console.log(req.session.passport.user.id);
  	console.log(intid);
  	
    db.Message.create({
      UserId: req.session.passport.user.id,
      FriendId: intid,
      chat_messages: req.body.chat_messages
    }).then(function(error){
    	console.log("one more time");
      res.end(); 
    }).catch(function(error){
    	res.json(error);
    });
    console.log("hit here too");
  });
};
