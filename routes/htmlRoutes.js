var path = require("path");

//error
var isAuthenticated = require("../config/middleware/isAuthenticated.js");
// var isAuthenticated = require("../config/middleware/passport.js");

// Routes from blog exercise
// =============================================================
module.exports = function(app) {

  // index route loads view.html
  app.get("/test-login", function(req, res) {
    if(req.user)
      return res.redirect("/test-success.html");

    res.sendFile(path.join(__dirname, "../public/test-login.html"));
  });

  app.get("/test-success", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/test-success.html"));
  });
  
//   app.get("/maps", function(req, res) {
//     res.sendFile(path.join(__dirname, "../public/maps.html"));
//   });

  app.get("/*", function(req, res) {
    res.redirect("/test-login.html");
  });
  

};
