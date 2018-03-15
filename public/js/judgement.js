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
	var updatedLocation = {
		latitude: latitude,
		longitude: longitude
	};

	$.ajax({
		type: "PUT",
		url: "/api/update-location",
		data: updatedLocation
	}).then(function(error){
		if(error)
			("#error-message").text("Could not update your location");
	});
}

function autoPopulateModal() {
	$.ajax({
		type: "POST",
		url: "/api/get-default-filter"
	}).then(function(sportsPreferences){
		for(var i = 0; i < sportsPreferences.length; i++)
			$("#" + sportsPreferences[i]).attr("checked", true);
	});

	$("#search-radius").val(5); //will need to update based on how search radius bar works
}

function sendPreferences(userAge) {
	//if (miles has been filled out then miles=that number)
	//else miles=5
	// var miles = $("#miles").val();
	// console.log(miles);
	// if(miles === "")
	var miles = 5;
	console.log(miles);

	var minAge = userAge - 5;

	var maxAge = userAge + 5;
	
	var genderselect=[];
	var selectval=$("#genderPref option:selected").val();

	if(selectval==="all")
		genderselect=["male","female","other"];
	else{
		genderselect=[selectval];
	}

	var sports=[];

    var fieldsToFill = ["weightlift", "run", "walk", "swim", "surf", "bike", "yoga", "pilates", "cardio", "dance", "rock", "gymnastics", "bowl", 
    "rowing", "tennis", "baseball", "basketball", "football", "soccer", "rugby", "volleyball", "golf", "hockey", "ice", "skateboard"];


    for(var i = 0; i < fieldsToFill.length; i++) {
        var fieldId = fieldsToFill[i];
        var field = $("#" + fieldId);

        if(field.is(":checked")){
            sports.push(fieldId);
        }
    }

	var preferences = {
		genderselect: genderselect,
		miles: miles,
		minAge: minAge,
		maxAge: maxAge,
		sports: sports
	};

	$.ajax({
		type: "POST",
		url: "/api/filter-judgees",
		data: preferences
	}).then(function(matches){
		// shuffle matches
		// function to display one of the matches
	});
}

function displayOption() {
	$.ajax({
		type: "POST",
		url: "/api/get-prof-pic"
	}).then(function(dataURL){
		$("#matchPic").attr("src", dataURL);
		//make sure we populate user-id!
	});
}

function addLike(){
	var likeId=$("#name").attr("user-id");

	var currentUser={
		likeId:likeId
	};

	$.ajax({
		type: "PUT",
		url: "/api/change-likes",
		data: currentUser
	}).then(function(likeData){
		$("#matchPic").attr("src", dataURL);
	});
}


$(document).ready(function(){
	var userAge;
	autoPopulateModal();

	$.ajax({
		type: "POST",
		url: "/api/get-age"
	}).then(function(dob){
		userAge = moment().diff(moment(dob), "years");
		$("#minAge").val(userAge - 5);
		$("#maxAge").val(userAge + 5);
		updateLocation();
		sendPreferences(userAge);
	});

	$("#kinect").on("click",function(event){
			addLike();
	});

  $('.userCardImg').height($('.userCardImg').width());
});


$(window).resize(function() {
  $('.userCardImg').height($('.userCardImg').width());
});



