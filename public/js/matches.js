// you need slick
// http://kenwheeler.github.io/slick/

function cardImgSize() {
	$('.userCardImg').each(function() {
		$(this).height($(this).width());
		$('.history').height($(this).width());
	})
}

$(document).ready(function(){
	$('.userCard').click(function () {
		$(".newKinectionsDiv").hide();
		$(".kinectionsDiv").hide();
		$(".content").show();
		cardImgSize();
	});

	$('#matches').click(function() {
		$(".newKinectionsDiv").show();
		$(".kinectionsDiv").show();
		$(".content").hide();
		cardImgSize();
	});

	$('#viewBio').click(function() {
		$(".chat").hide();
		$(".bio").show();
	})

	$('#viewChat').click(function() {
		$(".bio").hide();
		$(".chat").show();
	})

	cardImgSize();
});


$(window).resize(function() {
	cardImgSize();
	// $('.userCardImg').height($('.userCardImg').width());
});

