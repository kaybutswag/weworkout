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

function sendPreferences() {
	//if (miles has been filled out then miles=that number)
	//else miles=5

	var miles= $("#miles").val();
	
	//type will be number
	var genderselect=[];
	var selectval=$("#genderPref option:selected").val();

	if(selectval==="all"||){
		genderselect=["male","female","other"];
	}

	else{
		genderselect=selectval;
	}

	var sports=[];

    var fieldsToFill2 = ["weightlift", "run", "walk", "swim", "surf", "bike", "yoga", "pilates", "cardio", "dance", "rock", "gymnastics", "bowl", 
    "rowing", "tennis", "baseball", "basketball", "football", "soccer", "rugby", "volleyball", "golf", "hockey", "ice", "skateboard"];


    for(var i = 0; i < fieldsToFill2.length; i++) {
        var fieldId = fieldsToFill2[i];
        var field = $("#" + fieldId);

        if(field.is(":checked")){
            sports.push(fieldId);
        }
    }

	var preferences = {
		genderselect:genderselect,
		miles:miles,
		sports:sports
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
	var likeId=$("#idName").attr("user-id");

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
	updateLocation();
	sendPreferences();

	$("#kinect").on("click",function(event){
			addLike();
	});
});




