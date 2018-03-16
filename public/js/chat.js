
$(function () {

  var socket = io();
  // var chat_time = new Date();

  // $('#btnLogout').on("click", function () {
  //   event.preventDefault();
  //   localStorage.removeItem("Cache-ual-Corner");
  //   socket.disconnect();
  // });

  //on send message button click
  $('#btnSend').on("click", function () {
    event.preventDefault();
    var chat_messages = $('#m').val().trim();


        var chat = {
          chat_messages: chat_messages
        };

        // emit chat message using socket connection
        socket.emit('chat message', chat);
        //to store in db 
        $.post("/api/chat", chat)
          // On success, run the following code
          .then(function (data) {
            // Log the data we found
            console.log("chat row inserted");
          });
      

    $('#m').val('');
    socket.on('chat message', function (msg) {
      $('#messages').append(chat_messages);
      window.scrollTo(0, document.body.scrollHeight);
    });
  });
});

    

