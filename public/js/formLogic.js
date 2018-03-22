var profilePicURL = null;
var fileName = null;

function uploadFile(file, signedRequest, url, name){
    console.log(file);
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signedRequest);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            console.log("state changed!");
            var date = new Date();
            $(".userCardImg").attr("style", "background-image: url('"+url+"?" + date.getTime() + "')");
            $('.userCardImg').height($('.userCardImg').width());
            profilePicURL = url;
            fileName = name; 
        }
        else
            console.log("couldn't upload file");
    }
    xhr.send(file);
}

function fillInForm(preferences) {
    if(preferences !== null) {
        var fieldsToFill = ["name", "gender", "dob", "primaryLocation", "weightlift", "run", "walk",
        "swim", "surf", "bike", "yoga", "pilates", "cardio", "dance", "rock", "gymnastics", "bowl", 
        "rowing", "tennis", "baseball", "basketball", "football", "soccer", "rugby", "volleyball", 
        "golf", "hockey", "ice", "skateboard", "bio"];

    if(preferences.img !== null) {
        $(".userCardImg").attr("style", "background-image: url('"+preferences.img+"')");
        $(".userCardImg").height($(".userCardImg").width());
        profilePicURL = preferences.img;
        fileName = preferences.fileName;
    }

        for(var i = 0; i < fieldsToFill.length; i++) {
            var fieldId = fieldsToFill[i];
            var field = $("#" + fieldId);

            if(field.attr("type") === "checkbox") {
                if(preferences[fieldId] === true) {
                    field.attr("checked", true);

                    if($("#userActivities").text() === "Click to add activities") {
                        $("#userActivities").empty();
                        $("#userActivities").text($("#" + fieldsToFill[i]).attr("data-text"));

                    }
                    else
                        $("#userActivities").append(", " + $("#" + fieldsToFill[i]).attr("data-text"));
                }
            }
            else if(fieldId === "dob") {
                var date = preferences[fieldId].substring(0, 10);
                console.log(date);
                field.val(date);
            }
            else
                field.val(preferences[fieldId]);
        }
    }
}

function storePreferences() {
    var name=$("#name").val();
    var gender = $("#gender option:selected").val();
    if(gender === "blank")
        gender = null;

    var dob=$("#dob").val();

    var primaryLocation=$("#primaryLocation").val();
    var bio=$("#bio").val();

    var atLeastOneIsChecked=$('input[class="activity"]:checked').length;
    console.log(atLeastOneIsChecked);

    if (atLeastOneIsChecked === 0) {
        $("#errorMes").html("Please select at least one activity");
    }
    else {

       var newForm = {
            name: name,
            gender: gender,
            dob: dob,
            img: profilePicURL,
            fileName: fileName,
            primaryLocation: primaryLocation,
            weightlift: $("#weightlift").is(":checked"),
            run: $("#run").is(":checked"),
            walk: $("#walk").is(":checked"),
            swim: $("#swim").is(":checked"),
            surf: $("#surf").is(":checked"),
            bike: $("#bike").is(":checked"),
            yoga: $("#yoga").is(":checked"),
            pilates: $("#pilates").is(":checked"),
            cardio: $("#cardio").is(":checked"),
            dance: $("#dance").is(":checked"),
            rock: $("#rock").is(":checked"),
            gymnastics: $("#gymnastics").is(":checked"),
            bowl: $("#bowl").is(":checked"),
            rowing: $("#rowing").is(":checked"),
            tennis: $("#tennis").is(":checked"),
            baseball: $("#baseball").is(":checked"),
            basketball: $("#basketball").is(":checked"),
            football: $("#football").is(":checked"),
            soccer: $("#soccer").is(":checked"),
            rugby: $("#rugby").is(":checked"),
            volleyball: $("#volleyball").is(":checked"),
            golf: $("#golf").is(":checked"),
            hockey: $("#hockey").is(":checked"),
            ice: $("#ice").is(":checked"),
            skateboard: $("#skateboard").is(":checked"),
            bio: bio
       };

        $.ajax({
            type: "POST",
            url: "/api/user-form",
            data: newForm
        }).then(function(response){
            if(response === "next")
                window.location.replace("/judgement");
            else
                $("#errorMes").html("Please include your name, gender and date of birth");
        });
    }

}

function deleteImage(fileName) {
    if(fileName !== null) {
        $.ajax({
            type: "DELETE",
            url: "/aws/deleteimg/" + fileName
        }).then(function(response){
            if(response === "true") {
                profilePicURL = null;
                fileName = null;
            }
            else
                console.log("Unable to delete photo from AWS");
        });
    }
}

$(document).ready(function(){	

    $("input[name=picture]").change(function(){
        var file = $('#imgUpload').get()[0].files[0];
        if(typeof file !== "undefined") {
            var fileInfo = {
                type: file.type
            };

            $.ajax({
                type: "POST",
                url: "/aws/storeimg",
                data: fileInfo
            }).then(function(imageInfo){
                uploadFile(file, imageInfo.signedRequest, imageInfo.url, imageInfo.fileName)
            });
        }
    });

    $("#clear").on("click", function(event){
        event.preventDefault();
        deleteImage(fileName);
    });

	$("input[name=profileSubmit]").on("click", function(event){
        event.preventDefault();
        storePreferences();
	});

    $.ajax({
        type: "GET",
        url: "/api/user-preferences"
    }).then(function(preferences){
        fillInForm(preferences);
    });
});
