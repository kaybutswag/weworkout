function updateLocation() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			updateUserLocation(position.coords.latitude, position.coords.longitude);
		}, function(error){
			$("#location-unavailable").text("Could not update your location");
		});
	}
	else {
		$("#location-unavailable").text("Your browser did not let us store your location. You may update your location manually in the Settings tab.");
	}
}

function updateUserLocation(latitude, longitude) {
	var updateEmail = {
		latitude: latitude,
		longitude: longitude
	};

	$.ajax({
		type: "PUT",
		url: "/api/update-location",
		data: updateEmail
	}).then(function(error){
		if(error)
			("#location-unavailable").text("Could not update your location");
	});
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

	updateLocation();
});