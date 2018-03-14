var expanded = false;

function clearContents(element) {
  element.value = '';
}
<<<<<<< HEAD
//pic testing starts//
var imgSrcs =[
    "/img/crunch.jpg",
    "/img/bikes.jpg",
    "/img/deadlift.jpg",
    "/img/tennis.jpg",
    "/img/hiking.jpeg",
    "/img/highFive.jpg",
    "/img/waterBottles.jpg",
    "/img/weights.jpeg",
    "/img/yoga.jpeg",
    "/img/weightBar.jpeg",
    "/img/Golf.jpeg",
    "/img/streching.jpeg",
    "/img/jumpRope.jpeg",
];

$('#changingPic').delay(3000).fadeOut(2000, animateBackground());

function animateBackground() {
    window.setTimeout(function(){

        var url = imgSrcs[imgSrcs.push(imgSrcs.shift()) - 1];

        $('#changingPic').delay(3000).fadeOut(3000, function(){

            $(this).css("background-image", "url(" + url + ")")

        }).fadeIn(2000, animateBackground())

    });
}


// pic ends//
=======

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
>>>>>>> upstream/master
