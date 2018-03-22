var counter = 0;

function photoSlideshow() {
  if(counter > 0)
    $("#changingPic img").eq(counter - 1).removeClass("opaque");
  else
    $("#changingPic img").last().removeClass("opaque");
  $("#changingPic img").eq(counter).addClass("opaque");
  counter = (counter + 1) % $("#changingPic img").length;
}

function getLocation(email, password) {
	showIndicator();
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			hideLoader();
			createNewUser(email, password, position.coords.latitude, position.coords.longitude);
		}, function(error){
			hideLoader();
			createNewUser(email, password, null, null);
		});
	}
	else {
		hideLoader();
		createNewUser(email, password, null, null);
	}
}

function createNewUser(email, password, latitude, longitude) {
	var newUser = {
		email: email,
		password: password,
		latitude: latitude,
		longitude: longitude
	};

	$.ajax({
		type: "POST",
		url: "/api/new-user",
		data: newUser
	}).then(function(result){
		if(result === "success")
			logInUser(email, password, "newUser");
		else {
			if("errors" in result) {
				if(result.errors[0].path === "email")
					$("form p").text("The email you entered is not valid.");
				else if(result.errors[0].path === "password")
					$("form p").text("The password you entered is not valid.");
			}
			else if ("original" in result && "code" in result.original && result.original.code === "ER_DUP_ENTRY")
				$("form p").text("That email already exists");
			else
				$("form p").text("Please allow us to access your location.");
		}
	});
}

function logInUser(email, password, type) {
	var credentials = {
		email: email,
		password: password
	};

	$.ajax({
		type: "POST",
		url: "/api/login-user",
		data: credentials
	}).then(function(data){
		if(data === "error")
			$("form p").text("Sorry. There was a login error");
		else if(data === "user")
			$("form p").text("We could not find that username");
		else if(data === "password")
			$("form p").text("That password is incorrect");
		else {
			if(type === "oldUser")
				window.location.replace("/judgement");
			else
				window.location.replace("/profile");
		}
	});
}

function showIndicator(){
    $(".loginLogo").attr("class","loginLogo fa-spin");
}

function hideLoader(){
    $(".loginLogo").attr("class","loginLogo");
}

$(document).ready(function(){
	$(".signUp").on("click", function(event){
		event.preventDefault();
		var newEmail = $("input[name=email]").val();
		var newPassword = $("input[name=password]").val();

		getLocation(newEmail, newPassword);
	});

	$(".signIn").on("click", function(event){
		event.preventDefault();
		var email = $("input[name=email]").val();
		var password = $("input[name=password]").val();

		$("input[name=email]").val("");
		$("input[name=password]").val("");

		logInUser(email, password, "oldUser");

	});
	
	setInterval(photoSlideshow, 9000);
});
