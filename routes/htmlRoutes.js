var path = require("path");
var db = require("../models");

var isAuthenticated = require("../config/middleware/isAuthenticated.js");

// Routes from blog exercise
// =============================================================
module.exports = function(app) {

  // loads index.html page
  app.get("/", function(req, res) {
    if(req.user)
      res.redirect("/judgement");
    else
      res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/judgement", isAuthenticated, function(req, res){   
    db.Form.findOne({
      where: {
        email: req.user.email
      }
    }).then(function(response) {
      if(response !== null)
        res.sendFile(path.join(__dirname, "../public/judgement.html"));
      else
        res.redirect("/profile");   
    });
  }); 

  app.get("/profile", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/profile.html"));
  });

  app.get("/*", function(req, res) {
    if(req.user)
      res.redirect("/judgement");
    else
      res.redirect("/");
  });
  

};
