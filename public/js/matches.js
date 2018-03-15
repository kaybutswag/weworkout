// you need slick
// http://kenwheeler.github.io/slick/

function cardImgSize() {
	$('.userCardImg').each(function() {
		$(this).height($(this).width());
		$('.history').height($(this).width());
		$('#viewChat').width($(this).width());
		$('#viewBio').width($(this).width());
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
}


$(document).ready(function(){
  $.get("/api/myMatches", function(data) {
      if(data="nada"){
        console.log("test front");
        $(".newKinectionsDiv").empty();
        $(".newKinectionsDiv").html("<p>Sorry, no matches at the moment. We suggest broadening your preferences.</p><a href='/judgement'><button>Adjust Preferences</button></a>");
      }
      else{
        console.log(data);
      }
    });

	$('.userCard').click(function () {
		$(".newKinectionsBench").hide();
		$(".kinectionsBench").hide();
		$(".content").show();
		$("#returnMatch").show();
		cardImgSize();
	});

	$('#returnMatch').click(function() {
		$(".newKinectionsBench").show();
		$(".kinectionsBench").show();
		$(".content").hide();
		cardImgSize();
		$("#returnMatch").hide();
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

	slickInit();
	cardImgSize();
});


$(window).resize(function() {
	// little buggy
	slickInit();
	cardImgSize();
});

