
function generateChatHistory(screenFriendId) {
  var chathistory={
    FriendId:screenFriendId
  };

  $.post("/api/oldChat", chathistory)
  .then(function (data) {
    // console.log(data);
    if(data===null)
      return;
    for(var i=0; i<data.length;i++){
      if(parseInt(data[i].UserId)===parseInt(screenFriendId)){
        var theirMessage=$("<div>");
        theirMessage.addClass('friendMsg');
        theirMessage.text(data[i].chat_messages);
        $('#message_block').append($('<li>').html(theirMessage));
      }
      else{
        var myMessage=$("<div>");
        myMessage.addClass('userMsg');
        myMessage.text(data[i].chat_messages);
        $('#message_block').append($('<li>').html(myMessage));
      }
      $('.history').scrollTop($(".history")[0].scrollHeight);
    }
  });
}

$(function () {

  var socket = io();

  var myId;

  var screenFriendId;

  $.get("/api/myId",function(data){
    myId=data.myId;
  });

  $('.newKinectionsBench').on("click",".userCard",function () {
    $('#message_block').empty();
    screenFriendId = $(this).attr("data-value");
    generateChatHistory(screenFriendId);
  });

  $('.kinectionsBench').on("click",".userCard",function () {
    $('#message_block').empty();
    screenFriendId = $(this).attr("data-value");
    generateChatHistory(screenFriendId);
  });
  
//this updates with new chats
  $('#messageSend').on("click", function (event) {
    event.preventDefault();
    var FriendId = $('.userCard2').attr('data-value');
    var chat_messages = $('#m').val().trim();
    var chat={
      FriendId:FriendId,
      SenderId: myId,
      chat_messages:chat_messages
    };

    $.post("/api/pushChat", chat)
          // On success, run the following code
          .then(function (data) {
            // Log the data we found
            console.log("chat rows may be updated");
    });

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
    // console.log("received chat message");
    var newMessage=$("<div>");
    // console.log(myId);
    // console.log(msg.FriendId);
    // console.log(screenFriendId);
    if(parseInt(myId)===parseInt(msg.FriendId) && parseInt(screenFriendId) === parseInt(msg.SenderId))
      newMessage.addClass('friendMsg');
    else if(parseInt(screenFriendId)===parseInt(msg.FriendId) && parseInt(myId) === parseInt(msg.SenderId))
      newMessage.addClass('userMsg');
    else
      return;

    newMessage.text(msg.chat_messages);
    // $(".history").append(newMessage);
    $('#message_block').append($('<li>').html(newMessage));

    $('.history').stop().animate({scrollTop:$(".history")[0].scrollHeight},1000);
  });
});


