var path = require("path");
var isAuthenticated = require("../config/middleware/isAuthenticated.js");

// Routes from blog exercise
// =============================================================
module.exports = function(app) {

  // index route loads view.html
  app.get("/test-login", function(req, res) {
    if(req.user)
      return res.redirect("/test-success");

    res.sendFile(path.join(__dirname, "../public/test-login.html"));
  });

  app.get("/test-success", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/test-success.html"));
  });

  app.get("/*", function(req, res) {
    res.redirect("/test-login");
  });
};
