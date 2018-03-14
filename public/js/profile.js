var expanded = false;

function clearContents(element) {
  element.value = '';
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

  $("#submitActivities").click(function(event){
    $("#userActivities").empty();
    var activities = [];
    $('input[class="activity"]:checked').each(function() {
      activities.push($(this).data('text'));
    });
    console.log(activities);
    for (i=0;i<activities.length;i++) {
      if (i==activities.length - 1) {
        var entry = $("<span>"+activities[i]+"</span>");
        $("#userActivities").append(entry);
      } else {
        var entry = $("<span>"+activities[i]+", </span>");
        $("#userActivities").append(entry);
      }
    }
  })

  $("#clear").click(function(event){
    event.preventDefault();
    this.form.reset();
    // path changes with handlebars
    $(".userCardImg").attr("style", "background-image: url('img/placeholder.jpg')");
    $('.userCardImg').height($('.userCardImg').width());
    // $("input[name=picture]").value('')
  })

  $(".profileLink").click(function(){
    console.log("you clicked the profile link");
  });

  $(".judgementLink").click(function(){
    console.log("you clicked the judgement link");
  })

  $(".matchesLink").click(function(){
    console.log("you clicked the matches link");
  })

  $('.userCardImg').height($('.userCardImg').width());
});


$(window).resize(function() {
  $('.userCardImg').height($('.userCardImg').width());
});