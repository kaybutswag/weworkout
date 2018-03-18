var idforcontent;
var counter = 0;

function photoSlideshow() {
  if(counter > 0)
    $("#changingPic img").eq(counter - 1).removeClass("opaque");
  else
    $("#changingPic img").last().removeClass("opaque");
  $("#changingPic img").eq(counter).addClass("opaque");
  counter = (counter + 1) % $("#changingPic img").length;
}

function cardImgSize() {
	$('.userCardImg').each(function() {
		$(this).height($(this).width());
		$('.history').height($(this).width()-20);
		// $('#viewChat').width($(this).width());
		// $('#viewBio').width($(this).width());
	})

}

function slickInit() {
	$('.newKinectionsDiv').slick({
  dots: true,
  infinite: false,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
	});

	$('.kinectionsDiv').slick({
  // dots: true,
  infinite: false,
  speed: 300,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 1003,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
	});
}

function showInfo(number){
  var user = {
    id: number
  };
  $.ajax({
    type: "POST",
    url: "/api/getUserInfo", 
    data: user
  }).then(function(data){
      $(".userCard2").empty();
      var thisCardImg2=$("<div>");
      thisCardImg2.addClass("userCardImg");
      if (data.img === null) {
        thisCardImg2.attr("style","background-image: url('img/logoBlack.png')");
      } else {
        thisCardImg2.attr("style","background-image: url('"+data.img+"')");
      }
      $(".userCard2").append(thisCardImg2);
      $(".userCard2").attr("data-value",number);
      $(".userCard2").append("<h4 id='name2'>"+data.name+"</h4>");
      cardImgSize();

      $('#gender').text(data.gender);
      $('#location').text(data.primaryLocation);
      $('#age').text(moment().diff(moment(data.dob),"years"));
      $('#bio').text(data.bio);

      var sports2="";

      var fieldsToFill = ["weightlift", "run", "walk", "swim", "surf", "bike", "yoga", "pilates", "cardio", "dance", "rock", "gymnastics", "bowl", 
      "rowing", "tennis", "baseball", "basketball", "football", "soccer", "rugby", "volleyball", "golf", "hockey", "ice", "skateboard"];

      var actualActivity = ["Weightlifting", "Running", "Walking", "Swimming", "Surfing", "Biking", "Yoga", "Pilates", "Cardio", "Dancing",
      "Rock Climbing", "Gymnastics", "Bowling", "Rowing", "Tennis", "Baseball", "Basketball", "Football", "Soccer", "Rugby", "Volleyball", 
      "Golfing", "Hockey", "Ice Skating", "Skateboarding"];


      for(var i = 0; i < fieldsToFill.length; i++) {
          var activity = fieldsToFill[i];
          if(data[activity] === true) {
              if(sports2 === "") {
                sports2 += actualActivity[i];
              }
              else
                sports2 += ", " + actualActivity[i];
          }
      }

      $("#activities").text(sports2);
  });
}

$(document).ready(function(){
  $.get("/api/myMatches", function(data) {
      if(data==="nada"){
        $(".newKinectionsDiv").empty();
        $(".newKinectionsDiv").html("<p>Sorry, no matches at the moment. We suggest broadening your preferences.</p><a href='/judgement'><button>Adjust Preferences</button></a>");
      }
      else{
        $(".newKinectionsDiv").empty();
            for(var i=0;i<data.length;i++){
              var thisCard=$("<div>");
              thisCard.addClass("userCard");
              thisCard.attr("data-value",data[i].UserId);
              var thisCardImg=$("<div>");
              thisCardImg.addClass("userCardImg");
              if (data[i].img == null) {
                thisCardImg.attr("style","background-image: url('img/logoBlack.png')");
              } else {
                thisCardImg.attr("style","background-image: url('"+data[i].img+"')");
              }
              thisCard.append(thisCardImg);
              thisCard.append("<h4 id='name'>"+data[i].name+"</h4>");
              $(".newKinectionsDiv").append(thisCard);
        }
      }
      // slickInit();
      cardImgSize();
    });

  $.get("/api/myChats", function(data2) {
      if(data2==="nochats"){
        $(".kinectionsDiv").empty();
        $(".kinectionsDiv").html("<p>Looks like no chats have been started.</p>");
      }
      else{
        $(".kinectionsDiv").empty();
          for(var i=0;i<data2.length;i++){
              var thatCard=$("<div>");
              thatCard.addClass("userCard");
              thatCard.attr("data-value",data2[i].UserId);
              var thatCardImg=$("<div>");
              thatCardImg.addClass("userCardImg");
              if (data2[i].img == null) {
                thatCardImg.attr("style","background-image: url('img/logoBlack.png')");
              } else {
                thatCardImg.attr("style","background-image: url('"+data2[i].img+"')");
              };
              thatCard.append(thatCardImg);
              thatCard.append("<h4 id='name'>"+data2[i].name+"</h4>");
              $(".kinectionsDiv").append(thatCard);
          }
      }
      slickInit();
      cardImgSize();
    });

	$('.newKinectionsBench').on("click",".userCard",function () {
		$(".newKinectionsBench").hide();
		$(".kinectionsBench").hide();
    idforcontent=$(this).attr("data-value");
    showInfo(idforcontent);
		$(".content").show();
		$("#returnMatch").show();
		cardImgSize();
	});

  $('.kinectionsBench').on("click",".userCard",function () {
    $(".newKinectionsBench").hide();
    $(".kinectionsBench").hide();
    idforcontent=$(this).attr("data-value");
    showInfo(idforcontent);
    $(".content").show();
    $("#returnMatch").show();
    cardImgSize();
  });

	$('#returnMatch').click(function() {
    location.reload();
	});

	$('#viewBio').click(function() {
		$(".chat").hide();
		$(".bio").show();
		$("#viewChat").show();
		$("#viewBio").hide();
	})

	$('#viewChat').click(function() {
		$(".bio").hide();
		$(".chat").show();
		$("#viewBio").show();
		$("#viewChat").hide();
	})


  setInterval(photoSlideshow, 12000);
});

$(window).resize(function() {
	slickInit();
	cardImgSize();
});
