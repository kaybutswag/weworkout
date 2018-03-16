var db = require("../models");

module.exports = function (app) {

  app.post("/api/chat", function (req, res) {
    db.Message.create({
      // user1: req.body.id
      // user2: req.body.id2,
      chat_messages: req.body.msg
      // chat_time: req.body.time
    });

  });

};
