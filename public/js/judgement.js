var myBigArray=[];
var currentProfile=0;

function shuffleArray(arr){
	for(var i = 1; i < arr.length; i++) {
		var random = Math.floor(Math.random() * (i + 1));
		if(random !== i) {
			var dummy = arr[random];
			arr[random] = arr[i];
			arr[i] = dummy;
		}
	}
	return arr;
}

function updateLocation(userAge) {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
			updateUserLocation(position.coords.latitude, position.coords.longitude, userAge);
		}, function(error){
			$("#location-unavailable").text("Could not update your location");
			sendPreferences(userAge);
		});
	}
	else {
		$("#location-unavailable").text("Your browser did not let us store your location.");
		sendPreferences(userAge);
	}
}

function updateUserLocation(latitude, longitude, userAge) {
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
		sendPreferences(userAge);
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
	var miles = $("#miles").text();

	var minAge = $("#minAge").val();

	var maxAge = $("#maxAge").val();
	
	var genderselect=[];
	var selectval=$("#genderPref option:selected").val();

	if(selectval==="all")
		genderselect=["Male","Female","Other"];
	else
		genderselect=[selectval];

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
		matches = shuffleArray(matches);
		myBigArray = matches;
		currentProfile = 0;
		$("form").first().removeClass("display-none");
		$(".exhausted-options").addClass("display-none");
		showCard();
	});
}

function showCard(){
	if(currentProfile + 1 > myBigArray.length) {
		$("form").first().addClass("display-none");
		$(".exhausted-options").removeClass("display-none");
	}
	else {
		$("#name").text(myBigArray[currentProfile].name);
		$("#name").attr("user-id", myBigArray[currentProfile].UserId);
		$(".userCardImg").empty();
		$(".userCardImg").attr("style","background-image: url('"+myBigArray[currentProfile].img+"')");
		$('.userCardImg').height($('.userCardImg').width());
		$('#gender').text(myBigArray[currentProfile].gender);
		$('#location').text(myBigArray[currentProfile].primaryLocation);
		$('#age').text(moment().diff(moment(myBigArray[currentProfile].dob),"years"));
		$('#bio').text(myBigArray[currentProfile].bio);

		var sports2="";

	    var fieldsToFill = ["weightlift", "run", "walk", "swim", "surf", "bike", "yoga", "pilates", "cardio", "dance", "rock", "gymnastics", "bowl", 
	    "rowing", "tennis", "baseball", "basketball", "football", "soccer", "rugby", "volleyball", "golf", "hockey", "ice", "skateboard"];

	    var actualActivity = ["Weightlifting", "Running", "Walking", "Swimming", "Surfing", "Biking", "Yoga", "Pilates", "Cardio", "Dancing",
	    "Rock Climbing", "Gymnastics", "Bowling", "Rowing", "Tennis", "Baseball", "Basketball", "Football", "Soccer", "Rugby", "Volleyball", 
	    "Golfing", "Hockey", "Ice Skating", "Skateboarding"];


	    for(var i = 0; i < fieldsToFill.length; i++) {
	        var activity = fieldsToFill[i];
	        if(myBigArray[currentProfile][activity] === true) {
	            if(sports2 === "") {
	            	sports2 += actualActivity[i];
	            }
	            else
	            	sports2 += ", " + actualActivity[i];
	        }
	    }

	    $("#activities").text(sports2);

	    currentProfile++;
	}        
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
		console.log("like was stored");
	});
}


$(document).ready(function(){
	var userAge = -2;

	$.ajax({
		type: "POST",
		url: "/api/get-age"
	}).then(function(dob){
		userAge = moment().diff(moment(dob), "years");
		$("#minAge").val(userAge - 5);
		$("#maxAge").val(userAge + 5);
		updateLocation(userAge);
		autoPopulateModal(userAge);
	});

	$("#kinect").on("click",function(event){
		event.preventDefault();
		addLike();
		showCard();
	});

	$("#reject").on("click",function(event){
		showCard();
	});

	$("#submitActivities").on("click", function(){
		if(userAge > 0)
			sendPreferences(userAge);
	});

  $('.userCardImg').height($('.userCardImg').width());
});


$(window).resize(function() {
  $('.userCardImg').height($('.userCardImg').width());
});



