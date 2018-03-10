function createNewUser(email, password) {
	var newUser = {
		email: email,
		password: password
	};

	$.ajax({
		type: "POST",
		url: "/api/test-new-user",
		data: newUser
	}).then(function(error){
		if(error){
			if(error.errors[0].path === "email")
				$(".modal p").text("The email you entered is not valid.");
			else
				$(".modal p").text("The password you entered is not valid.");
		}
		else {
			$("#create-account-form").modal("hide");
		}
	});
}

$(document).ready(function(){
	
	$("#create-account").on("click", function(){
		$("#create-account-form").modal("show");
		$(".modal p").empty();
	});

	$(".modal button").on("click", function(){
		var newEmail = $("#new-email").val();
		var newPassword = $("#new-password").val();

		$("#new-email").val("");
		$("#new-password").val("");

		$(".modal p").empty();
		createNewUser(newEmail, newPassword);
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
			window.location.replace(data);
		});
	});

});