//get geolocation
var foundLocation = false;
function getLocation() {
    showIndicator();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,handleErr);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    $("#loader").removeClass("loader");
    console.log("Latitude: " + position.coords.latitude +
        " Longitude: " + position.coords.longitude);
}

function handleErr(err) {
    console.log( "Geolocation failed " + err);
}
var started = false;
function myFirst(){
    getLocation();
}

function showIndicator(){
    $("#loader").addClass("loader");
}

function hideLoader(){
    $("#loader").removeClass("loader");
}

// this can be used to match people

//should we be ranking people? Randomizing those that fit
