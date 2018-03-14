var path = require("path");

//error
var isAuthenticated = require("../config/middleware/isAuthenticated.js");
// var isAuthenticated = require("../config/middleware/passport.js");

// Routes from blog exercise
// =============================================================
module.exports = function(app) {

  // loads index.html page
  app.get("/", function(req, res) {
    if(req.user)
      return res.redirect("/matches");

    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/judgement", isAuthenticated, function(req, res){
    /* Katharine: add a function to see if user has preferences stored (you can get user's
    email with req.user.email and then use that to get the user's id); if the user does
    not have any preferences stored, redirect to "/profile"; otherwise, send matches.html */

    res.sendFile(path.join(__dirname, "../public/judgement.html"));    
  });

  app.get("/matches", isAuthenticated, function(req, res){


    res.sendFile(path.join(__dirname, "../public/matches.html"));    
  });

  app.get("/profile", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/profile.html"));
  });

  app.get("/*", function(req, res) {
    res.redirect("/");
  });
  

};
