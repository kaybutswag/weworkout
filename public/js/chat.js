
$(function () {

  var socket = io();
  // var chat_time = new Date();

  // $('#btnLogout').on("click", function () {
  //   event.preventDefault();
  //   localStorage.removeItem("Cache-ual-Corner");
  //   socket.disconnect();
  // });

  //on send message button click
  $('#messageSend').on("click", function (event) {

    event.preventDefault();
    var chat_messages = $('#m').val().trim();
    var FriendId = $('.userCard2').attr("data-value");
    console.log(chat_messages);

    var chat={
      FriendId:FriendId,
      chat_messages:chat_messages
    };

    socket.emit('chat message', chat);

        $.post("/api/newChat", chat)
          // On success, run the following code
          .then(function (data) {
            // Log the data we found
            console.log("chat row inserted");
          });

        // // emit chat message using socket connection
        // socket.emit('chat message', chat);
        // //to store in db 
        // $.post("/api/chat", chat)
        //   // On success, run the following code
        //   .then(function (data) {
        //     // Log the data we found
        //     console.log("chat row inserted");
        //   });
      

    $('#m').val('');
    });

    socket.on('chat message', function (msg) {
      var newMessage=$("<div>");
      newMessage.addClass('userMsg');
      newMessage.text(msg.chat_messages);
      // $(".history").append(newMessage);
      $('#message_block').append($('<li>').html(newMessage));
      window.scrollTo(0, document.body.scrollHeight);
    });
  
});

// <script>
//       $(function () {
//         var socket = io();
//         // var socket = io("http://localhost:8000/socket");
//         $('form').submit(function(){
//           socket.emit('chat message', $('#m').val());
//           $('#m').val('');
//           return false;
//         });
//         socket.on('chat message', function(msg){
//           $('#messages').append($('<li>').text(msg));
//           window.scrollTo(0, document.body.scrollHeight);
//         });
//       });
//     </script>

  // 
      // $(function () {
      //   var socket = io();
      //   // var socket = io("http://localhost:8000/socket");
      //   $('form').submit(function(){
      //     socket.emit('chat message', $('#m').val());
      //     $('#m').val('');
      //     return false;
      //   });
      //   socket.on('chat message', function(msg){
      //     $('#messages').append($('<li>').text(msg));
      //     window.scrollTo(0, document.body.scrollHeight);
      //   });
      // });
