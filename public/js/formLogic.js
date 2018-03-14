var reader = new FileReader();
var readerResult;

function previewFile(input) {
    if(input.files && input.files[0]) {
        reader.onload = function() {
            // var previewImage = $("<img width = 'auto' height = '100%'>");
            // previewImage.attr("src", reader.result);
            // $(".userCardImg").empty();
            // $(".userCardImg").append(previewImage);
            $(".userCardImg").attr("style", "background-image: url('"+reader.result+"')");
            $('.userCardImg').height($('.userCardImg').width());
            readerResult = reader.result;
        };

    reader.readAsDataURL(input.files[0]);
    }
}

function fillInForm(preferences) {
    if(preferences !== null) {
        var fieldsToFill = ["name", "gender", "dob", "primaryLocation", "weightlift", "run", "walk",
        "swim", "surf", "bike", "yoga", "pilates", "cardio", "dance", "rock", "gymnastics", "bowl", 
        "rowing", "tennis", "baseball", "basketball", "football", "soccer", "rugby", "volleyball", 
        "golf", "hockey", "ice", "skateboard", "bio"];

    if(preferences.img !== null) {
        $(".userCardImg").attr("style", "background-image: url('"+preferences.img+"')");
        $(".userCardImg").empty();
        $(".userCardImg").append("<img width = '100%' height = 'auto' src = '" + preferences.img + "'>");
    }

        for(var i = 0; i < fieldsToFill.length; i++) {
            var fieldId = fieldsToFill[i];
            var field = $("#" + fieldId);

            if(field.attr("type") === "checkbox") {
                if(preferences[fieldId] === true)
                    field.attr("checked", true);
            }
            else if (fieldId === "dob") {
                var date = preferences[fieldId].substring(0, 10);
                console.log(date);
                field.val(date);
            }
            else
                field.val(preferences[fieldId]);
        }
    }
}

$(document).ready(function(){	

    $("input[name=picture]").change(function(){
        // $(".imgPlace").empty();
        previewFile(this);
    });

	$("input[name=profileSubmit]").on("click", function(event){
        event.preventDefault();

	    var name=$("#name").val();
	    var gender = $("#gender option:selected").val();
        if(gender === "blank")
            gender = null;

        //date stuff
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
                img: readerResult,
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
	});

    $.ajax({
        type: "POST",
        url: "/api/user-preferences"
    }).then(function(preferences){
        fillInForm(preferences);
    });
});
