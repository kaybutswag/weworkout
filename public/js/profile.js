var expanded = false;

function clearContents(element) {
  element.value = '';
}

//pic looping starts//
$(document).ready(function() {
  var counter = 0;
  setInterval(myFunc, 9000);
  function myFunc() {
    var newImage = counter;
    $("#changingPic img").eq(newImage).addClass("opaque");
    counter++;
  }
});
// pic looping ends//

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
    $(".imgPlace").empty();
    // path changes with handlebars
    $(".imgPlace").append('<img src="img/placeholder.jpg">');
    $("input[name=picture]").value('')
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
});
