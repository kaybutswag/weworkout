

$(function () {

  var socket = io();

  var FriendId;

  var myId;


$.get("/api/myId",function(data){
  myId=data.myId;

});



  $('.newKinectionsBench').on("click",".userCard",function () {
    FriendId = $(this).attr("data-value");

    console.log(FriendId);

    var chathistory={
      FriendId:FriendId
    };

    $.post("/api/oldChat/", chathistory )
        .then(function (data) {
            console.log(data);
      if(data===null){
          return;
      }

      for(var i=0; i<data.length;i++){

      if(parseInt(data[i].UserId)===parseInt(FriendId)){
          console.log("their match");

        var theirMessage=$("<div>");
        theirMessage.addClass('friendMsg');
        theirMessage.text(data[i].chat_messages);
        $('#message_block').append($('<li>').html(theirMessage));

      }else{
        var myMessage=$("<div>");
        myMessage.addClass('userMsg');
        myMessage.text(data[i].chat_messages);
        $('#message_block').append($('<li>').html(myMessage));

      }
      $('.history').stop().animate({scrollTop:$(".history")[0].scrollHeight},1000);
    }
    });

    
  });

  


//this upates with new chats
  $('#messageSend').on("click", function (event) {
    event.preventDefault();

    FriendId = $('.userCard2').attr("data-value");
    var chat_messages = $('#m').val().trim();
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
      

    $('#m').val('');
    });

    socket.on('chat message', function (msg) {
      console.log(msg);
      var newMessage=$("<div>");
      console.log(myId);
      console.log(msg.FriendId);
      if(parseInt(myId)===parseInt(msg.FriendId))
        newMessage.addClass('friendMsg');
      else
        newMessage.addClass('userMsg');

      newMessage.text(msg.chat_messages);
      // $(".history").append(newMessage);
      $('#message_block').append($('<li>').html(newMessage));

      $('.history').stop().animate({scrollTop:$(".history")[0].scrollHeight},1000);
    });
});

