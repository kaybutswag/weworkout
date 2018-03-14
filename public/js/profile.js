var expanded = false;

function showCheckboxes() {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}

function clearContents(element) {
  element.value = '';
}
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
