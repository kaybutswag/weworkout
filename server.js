var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");

var passport = require("./config/passport");

var app = express();
var PORT = process.env.PORT || 8000;

var db = require("./models");

app.use(bodyParser({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({ secret: "W929Ugh5TY3rz", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);

//changed force to false for testing filter
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});