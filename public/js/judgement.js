var myBigArray=[
	{
 "name" : "Peter Jackson",
 "UserId" : "3",
 "img" : "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_80%2Cw_300/MTE4MDAzNDEwMTU3Mjc0NjM4/peter-jackson-37009-1-402.jpg",
 "gender" : "Male",
"primaryLocation" : "Austin, Tx",
"dob" : "10/24/1974",
"bio" : "I love not working and making movies instead."
},
{
 "name" : "Bubbles",
 "UserId" : "4",
 "img" : "https://i.ytimg.com/vi/CMv0V9LqLRo/hqdefault.jpg",
 "gender" : "Other",
"primaryLocation" : "Southern Trailer",
"dob" : "09/14/1998",
"bio" : "I love cats"
},
{
 "name" : "Bruce Banner",
 "UserId" : "5",
 "img" : "https://images-na.ssl-images-amazon.com/images/G/01/digital/video/hero/Movies/2003/B00285K1KE_Hulk_UXNB1._V142676592_RI_SX940_.jpg",
 "gender" : "Male",
"primaryLocation" : "Gold's Gym",
"dob" : "07/04/1983",
"bio" : "Lifting is my game",
"activity" : []
}
];
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
	if(myBigArray[currentProfile]) {

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

		//No more matches, myBigArray[currentProfile] is empty
	} else{
		$("#noMatches").show();
		$("#name").hide();
		$(".userCardImg").hide();
		$('#gender').hide();
		$('#location').hide();
		$('#age').hide();
		$('#bio').hide();
		$('#noMatches').html("No more matches. <br> <a href='#openModal'>Try a new search</a>");
		$("#noMatches").css("font-weight", "900");
		$("#noMatches").css("font-size", "35px");
		$("#noMatches").css("text-align", "center");
		$('#box2').hide();
		$('#userCardImg').hide();
		$('#reject').hide();
		$('#kinect').hide();
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
			kinnected();
	});

	$("#reject").on("click",function(event){
			// some code
			rejected();
	});

  $('.userCardImg').height($('.userCardImg').width());

	$("#submitActivities").on("click",function(event){
		//add logic to perforn new search
		//for now set currenProfile back to 0 to repeat hard coded profiles
		currentProfile = 0;
		hideNoMatches();
		showCard();
	});
});

$(window).resize(function() {
  $('.userCardImg').height($('.userCardImg').width());
});
//matchBox animation
function rejected() {
  var elem = document.getElementById("matchBox");
	elem.classList.add("rejected");
  var pos = 0;
  var id = setInterval(frame, 1);
  function frame() {
    if (pos >= 1000) {
      pos=0;
      elem.style.top.left = pos + 'px';
      elem.style.right = pos + 'px';
      clearInterval(id);
			elem.classList.remove("rejected");
			showCard();
    } else {
      pos += 20;
      elem.style.top.left = pos + 'px';
      elem.style.right = pos + 'px';
    }
  }
}


function kinnected() {
  var elem = document.getElementById("matchBox");
	elem.classList.add("kinnected");
  var pos = 0;
  var id = setInterval(frame, 1);
  function frame() {
    if (pos <= -1000) {
      pos=0;
      elem.style.top.left = pos + 'px';
      elem.style.right = pos + 'px';
      clearInterval(id);
			elem.classList.remove("kinnected");
			addLike();
			showCard();
    } else {
      pos -= 20;
      elem.style.top.left = pos + 'px';
      elem.style.right = pos + 'px';
    }
  }
}
// matchBox ends//

//pic looping starts//
$(document).ready(function() {
  var counter = 0;
  setInterval(myFunc, 9000);
  function myFunc() {
    var newImage = counter;
    $("#changingPic img").eq(newImage).addClass("opaque");
    counter++;
		if(counter === 13){
			counter = 0;
			for(var i=0; i<13; i++){
				$("#changingPic img").eq(i).removeClass("opaque");
			}
		}
	}
});
// pic looping ends//

function hideNoMatches(){
	$("#name").show();
	$(".userCardImg").show();
	$('#gender').show();
	$('#location').show();
	$('#age').show();
	$('#bio').show();
	$('#noMatches').hide();
	$('#box2').show();
	$('#userCardImg').show();
	$('#reject').show();
	$('#kinect').show();
}
