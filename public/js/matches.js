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
			("p").text("Could not update your location");
	});
}

function displayProfPic() {
	$.ajax({
		type: "POST",
		url: "/api/get-prof-pic"
	}).then(function(dataURL){
		$("img").attr("src", dataURL);
	});
}

$(document).ready(function(){
	updateLocation();
	displayProfPic();
});