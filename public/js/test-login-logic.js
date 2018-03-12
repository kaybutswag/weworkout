var reader = new FileReader();

function getLocation(email, password) {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			createNewUser(email, password, position.coords.latitude, position.coords.longitude);
		}, function(error){
			createNewUser(email, password, null, null);
			$("form p").text("Your browser did not let us store your location. You may update your location manually in the Settings tab.");
		});
	}
	else {
		$("form p").text("Your browser did not let us store your location. You may update your location manually in the Settings tab.");
		createNewUser(email, password, null, null);
	}
}

function createNewUser(email, password, latitude, longitude) {
	var newUser = {
		email: email,
		password: password,
		latitude: latitude,
		longitude: longitude,
		profilepic: reader.result
	};

	$.ajax({
		type: "POST",
		url: "/api/test-new-user",
		data: newUser
	}).then(function(error){
		if(error){
			if("errors" in error) {
				if(error.errors[0].path === "email")
					$(".modal p").text("The email you entered is not valid.");
				else if(error.errors[0].path === "password")
					$(".modal p").text("The password you entered is not valid.");
				else if(error.errors[0].path === "profilepic")
					$(".modal p").text("Please include a picture of yourself.");
			}
			else
				$(".modal p").text("There was an error. Please try again.");
		}
		else {
			$("#create-account-form").modal("hide");
			window.location.replace("/test-success");
		}
	});
}

function previewFile(input) {
	if(input.files && input.files[0]) {
		reader.onload = function() {
			var previewImage = $("<img width = '40%' height = 'auto'>");
			previewImage.attr("src", reader.result);
			$("#image-holder").empty();
			$("#image-holder").append(previewImage);
		};

	reader.readAsDataURL(input.files[0]);
	}
}

$(document).ready(function(){	
	$("#create-account").on("click", function(){
		$("#create-account-form").modal("show");
		$("#image-holder").empty();
		$(".modal p").empty();
	});

	$(".modal button").on("click", function(){
		var newEmail = $("#new-email").val();
		var newPassword = $("#new-password").val();

		$("#new-email").val("");
		$("#new-password").val("");

		$(".modal p").empty();
		$("form p").empty();
		getLocation(newEmail, newPassword);
	});

	$("#submit-login").on("click", function(){

		var email = $("#email").val();
		var password = $("#password").val(); 

		var credentials = {
			email: email,
			password: password
		};

		$("#email").val("");
		$("#password").val("");

		$.ajax({
			type: "POST",
			url: "/api/test-login-user",
			data: credentials
		}).then(function(data){
			if(data === "error")
				$("form p").text("Sorry. There was a login error");
			else if(data === "user")
				$("form p").text("We could not find that username");
			else if(data === "password")
				$("form p").text("That password is incorrect");
			else {
				window.location.replace("/test-success");
			}
		});
	});

	$("#new-profpic").change(function(){
		$(".modal form img").remove();
		previewFile(this);
	});
});