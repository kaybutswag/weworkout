var currentProfile=0;
var counter=0;
var myBigArray = [];

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

function photoSlideshow() {
  if(counter > 0)
    $("#changingPic img").eq(counter - 1).removeClass("opaque");
  else
    $("#changingPic img").last().removeClass("opaque");
  $("#changingPic img").eq(counter).addClass("opaque");
  counter = (counter + 1) % $("#changingPic img").length;
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
		$("#loader_judgement").addClass("display-none");
		$("form").first().removeClass("display-none");
		$(".exhausted-options").addClass("display-none");
		showCard();
	});
}

function showCard(){
	console.log("showed card");
	if(currentProfile + 1 > myBigArray.length) {
		console.log("options exhausted");
		$("form").first().addClass("display-none");
		$(".exhausted-options").removeClass("display-none");
	}
	else {
		$("form").first().removeClass("display-none");
		var theirDOB = moment(myBigArray[currentProfile].dob).utc().format('YYYY-MM-DD');
		var theirAge = moment().diff(moment(theirDOB), "years")
		$("#name").text(myBigArray[currentProfile].name);
		$("#name").attr("user-id", myBigArray[currentProfile].UserId);
		$(".userCardImg").empty();
		$(".userCardImg").attr("style","background-image: url('"+myBigArray[currentProfile].img+"')");
		$('.userCardImg').height($('.userCardImg').width());
		$('#gender').text(myBigArray[currentProfile].gender);
		$('#location').text(myBigArray[currentProfile].primaryLocation);
		$('#age').text(theirAge);
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
	}).then(function(matchNotification){
		if(matchNotification.result === "match")
			notifyAboutMatch(matchNotification.myName, matchNotification.theirName, matchNotification.myPhoto, matchNotification.theirPhoto);
	});
}

//will write to front-end once match modal is designed
function notifyAboutMatch(myName, theirName, myPhoto, theirPhoto) {
	console.log(myName);
	console.log(theirName);
	if(myPhoto !== null)
		console.log(myPhoto.charAt(1));
	else
		console.log("null");
	if(theirPhoto !== null)
		console.log(theirPhoto.charAt(1));
	else
		console.log("null");
}

$(document).ready(function(){
	var userAge = -2;

	$.ajax({
		type: "POST",
		url: "/api/get-age"
	}).then(function(dob){
		userDOB = moment(dob).utc().format("YYYY-MM-DD");
		userAge = moment().diff(moment(userDOB), "years");
		$("#minAge").val(userAge - 5);
		$("#maxAge").val(userAge + 5);
		updateLocation(userAge);
		autoPopulateModal(userAge);
	});

	$("#kinect").on("click",function(event){
		event.preventDefault();
		$("form").first().animate({
			left: "1200px"
		}, function(){
			$("form").first().addClass("display-none");
			$("form").first().animate({
				left: "0px"
			}, function() {
				//var result will determine if we have a match or not
				//if result is true, we have a match so we do not move on the next userCard until user closes dialog
				var result = checkIfMatches();
				//if result is false, we do not have a match and we move to the next userCard
				if(result !== true){
						kinnected();
				}
			});
		});
	});

	$("#reject").on("click",function(event){
		event.preventDefault();
		$("form").first().animate({
			left: "-1200px"
		}, function(){
			$("form").first().addClass("display-none");
			$("form").first().animate({
				left: "0px"
			}, function() {
				showCard();
			});
		});
	});

	$("#submitActivities").on("click", function(){
		if(userAge > 0) {
			$("#loader_judgement").removeClass("display-none");
			$("form").first().addClass("display-none");
			$(".exhausted-options").addClass("display-none");
			sendPreferences(userAge);
		}
	});

	$('.userCardImg').height($('.userCardImg').width());

	setInterval(photoSlideshow, 9000);
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

//checkIfMatches is where the logic to check if we have a match is,
//currently I hard coded Bubbles to be a match based on name.
//The function returns true if we have a match, the dialog will open, and upon close of dialog we show next userCard
//If the function returns false we do not have a match and we move on to the next userCard
function checkIfMatches(){
	if( currentProfile - 1 >= 0 ){
		if (myBigArray[currentProfile - 1].name === "Bubbles") {
			displayMatchDialog();
		  displayMatchImages();
			displayMatchOptions();
			displayMatchName();
			displayMatchMessage();
			return true;
		}
	}
	return false;
}

//function to hide dialog and move on the next userCard after we found a match
function removeDialog(){
	hideMatchDialog();
	hideMatchImages();
	hideMatchOptions();
	hideMatchNameAndMessage();
	kinnected();
}
//jquery methods to show and hide dialog
function displayMatchDialog(){
	$('#newMatch').removeClass("disableBackground");
	$('#newMatch').addClass("newMatch");
	$('#newMatch').addClass("dialog")
	$('#newMatch').addClass("op-match--overlay")
	$('#newMatch').show();
	$('#overlay').addClass("overlay")
	$('#overlay').show();
}

function displayMatchImages(){
	$('#pic1').addClass("matchedCardImgUser");
	$('#pic2').addClass("matchedCardImg");
	$(".matchedCardImg").empty();
	$(".matchedCardImg").attr("style","background-image: url('"+myBigArray[currentProfile-1].img+"')");
	$('.matchedCardImg').height('150px');
	$('.matchedCardImg').width('150px');
	$(".matchedCardImgUser").empty();
	$(".matchedCardImgUser").attr("style","background-image: url('"+myBigArray[0].img+"')");
	$('.matchedCardImgUser').height('150px');
	$('.matchedCardImgUser').width('150px');
	$('#matchedPic1').addClass('column');
	$('#matchedPic2').addClass('column');
}

function displayMatchOptions(){
	$('#chat').addClass('columnForOptions');
	$('#chat').addClass('options');
	$('#continue').addClass('columnForOptions');
	$('#continue').addClass('options');
	$("#chatText").text("Start a Chat");
	$("#continueText").text("Continue");
}

function displayMatchName(){
	$('#matchedName').addClass('matchedName');
	$('#matchedName').text(myBigArray[currentProfile-1].name + " is now a match!");
}

function displayMatchMessage(){
	$('#matchedMessage').addClass("matchedMessage");
	$('#matchedMessage').html("<a> Congratulations! <br> You guys kinnected! </a>");
}

function hideMatchDialog(){
	$('#newMatch').removeClass("newMatch");
	$('#newMatch').removeClass("dialog")
	$('#newMatch').removeClass("op-match--overlay")
	$('#newMatch').hide();
	$('#overlay').removeClass("overlay")
	$('#overlay').hide();
}

function hideMatchImages(){
	$('#pic1').removeClass("userCardImg");
	$('#pic2').removeClass("userCardImg");
	$(".userCardImg").empty();
	$('#matchedPic1').removeClass('column');
	$('#matchedPic2').removeClass('column');
}

function hideMatchOptions(){
	$('#chat').removeClass('columnForOptions');
	$('#continue').removeClass('columnForOptions');
	$('#chat').removeClass('options');
	$('#continue').removeClass('options');
}

function hideMatchNameAndMessage(){
	$('#matchedName').removeClass('matchedName');
	$('#matchedMessage').removeClass("matchedMessage");
}
//jquery methods to show and hide dialog ends
