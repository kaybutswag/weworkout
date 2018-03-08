var path = require("path");

// Routes from blog exercise
// =============================================================
module.exports = function(app) {

  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/people", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/people.html"));
  });

  // blog route loads blog.html
  app.get("/profile", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/profile.html"));
  });

};
