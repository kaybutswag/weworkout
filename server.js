var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var server = require("http").Server(app);
var session = require("express-session");
var io = require("socket.io")(server);
var passport = require("./config/passport");
var db = require("./models");
var db = require("./models");

var PORT = process.env.PORT || 8000;

// Method override for RESTFul form submissions
app.use(methodOverride("_method"));

app.use(bodyParser({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({ secret: "W929Ugh5TY3rz", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);
require("./routes/chatApiRoutes.js")(app);

//changed force to false for testing filter

db.sequelize.sync({ force: false }).then(function() {
  server.listen(PORT, function() {
    console.info(
      "==> Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//     console.log("test connection2");
//   });
// });
// Listen for new client connections.
// io.on('connection', function(socket) {

//   // Listen for the client to send a _"chat message"_ message.
//   socket.on('chat message', function(data) {

//     // Store the data in the database.
//     models.Messages.create({
//       message  : data.message,
//       username : data.username,
//       recipient: data.recipient
//     });

//   });
// });

io.on('connection', function (socket) {
  console.log('connection established');

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });

  // socket.on('disconnect', function () {
  //   console.log('user disconnected   ' + socket.id);
  // });

});