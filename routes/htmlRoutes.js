var path = require("path");
var isAuthenticated = require("../config/middleware/isAuthenticated.js");

// Routes from blog exercise
// =============================================================
module.exports = function(app) {

  // index route loads view.html
  app.get("/test-login", function(req, res) {
    console.log("at login page");
    if(req.user)
      res.redirect("/test-success");

    res.sendFile(path.join(__dirname, "../public/test-login.html"));
  });

  app.get("/test-success", isAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, "../public/test-success.html"));
  });

};


/*Template for a route that can only be accessed by a logged-in user

  app.get("/dummy", isAuthenticated, function(req, res){
    res.sendFile(path.join(__dirname, "../public/something.html"))
  })
*/
