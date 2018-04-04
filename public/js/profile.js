var expanded = false;
var counter = 0;

function clearContents(element) {
  element.value = '';
}

function photoSlideshow() {
  if(counter > 0)
    $("#changingPic img").eq(counter - 1).removeClass("opaque");
  else
    $("#changingPic img").last().removeClass("opaque");
  $("#changingPic img").eq(counter).addClass("opaque");
  counter = (counter + 1) % $("#changingPic img").length;
}

$(document).ready(function(){
  $("#logout").on("click", function(){
    $.ajax({
      method: "GET",
      url: "/logout"
    }).then(function(data){
      window.location.reload();
    });
  });

  $("#mobileLogout").on("click", function(){
    $.ajax({
      method: "GET",
      url: "/logout"
    }).then(function(data){
      window.location.reload();
    });
  });

  $("#submitActivities").click(function(event){
    $("#userActivities").empty();
    var activities = [];
    var entry;
    $('input[class="activity"]:checked').each(function() {
      activities.push($(this).data('text'));
    });
    for (i=0;i<activities.length;i++) {
      if (i===(activities.length - 1)) {
        entry = $("<span>"+activities[i]+"</span>");
        $("#userActivities").append(entry);
      } else {
        entry = $("<span>"+activities[i]+", </span>");
        $("#userActivities").append(entry);
      }
    }
  })

  $("#clear").click(function(event){
    event.preventDefault();
    this.form.reset();
    // path changes with handlebars
    $(".userCardImg").attr("style", "background-image: url('img/logoBlack.png')");
    $('.userCardImg').height($('.userCardImg').width());
    // $("input[name=picture]").value('')
  })

  $('.userCardImg').height($('.userCardImg').width());

  $('#imgUpload').hide();

  $('#imgUploadBtn').click(function(event){
    event.preventDefault();
    $('#imgUpload').trigger('click');
  });

  setInterval(photoSlideshow, 9000);

});

$(window).resize(function() {
  $('.userCardImg').height($('.userCardImg').width());
});
