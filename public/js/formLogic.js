var reader = new FileReader();
var readerResult;

function previewFile(input) {
    if(input.files && input.files[0]) {
        reader.onload = function() {
            var previewImage = $("<img width = '100%' height = 'auto'>");
            previewImage.attr("src", reader.result);
            $(".imgPlace").empty();
            $(".imgPlace").append(previewImage);
            readerResult = reader.result;
        };

    reader.readAsDataURL(input.files[0]);
    }
}

function fillInForm(preferences) {
    var fieldsToFill = ["name", "gender", "age", "primaryLocation", "weightlift", "run", "walk",
    "swim", "surf", "bike", "yoga", "pilates", "cardio", "dance", "rock", "gymnastics", "bowl", 
    "rowing", "tennis", "baseball", "basketball", "football", "soccer", "rugby", "volleyball", 
    "golf", "hockey", "ice", "skateboard", "bio"];

    if(preferences.img !== null)
        $(".imgPlace").append("<img width = '100%' height = 'auto' src = '" + preferences.img + "'>");

    for(var i = 0; i < fieldsToFill.length; i++) {
        var fieldId = fieldsToFill[i];
        var field = $("#" + fieldId);

        if(field.attr("type") === "checkbox") {
            if(preferences[fieldId] === true)
                field.attr("checked", true);
        }
        else
            field.val(preferences[fieldId]);
    }
}

$(document).ready(function(){	

    $("input[name=picture]").change(function(){
        $(".imgPlace").empty();
        previewFile(this);
    });

	$("input[name=profileSubmit]").on("click", function(event){
        event.preventDefault();

	    var name=$("#name").val();
	    var gender = $("#gender option:selected").val();

        //date stuff
	    var dob=$("#dob").val();
        console.log(dob);
        console.log(typeof dob);
        var convertedDOB=moment(dob,'YYYY-MM-DD HH:mm:ss');
        console.log(convertedDOB);
        console.log(typeof convertedDOB);
        var years=moment().diff(moment(dob),"years");
        console.log(years);

	    var primaryLocation=$("#primaryLocation").val();
        var bio=$("#bio").val();

        var atLeastOneIsChecked=$('#checkboxes input[type=checkbox]:checked').length;
        console.log(atLeastOneIsChecked);

        if (name===""){
            $("#errorMes").html("Name is required for profile");
        }

        else if (gender==="blank"){
            $("#errorMes").html("Please select your gender");
        }


        else if (primaryLocation ===""){
            $("#errorMes").html("Please store your Primary Location");
        }

        else if (atLeastOneIsChecked === 0){
            $("#errorMes").html("Please select at least one activity.");
        }

        else if ((name!=="")&&(gender!=="blank")&&(primaryLocation!=="")&&(atLeastOneIsChecked>0)){

    	var newForm = {
    	name: name,
        gender: gender,
        age: years,
        // dob: convertedDOB,
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
    	}).then(function(error){
    		if(error){
    			console.log(error);
    		}
    		else {
    			console.log("successful form");
    		}
    	});
    }
    else{
        console.log("other error");
    }
	});

    $.ajax({
        type: "POST",
        url: "/api/user-preferences"
    }).then(function(preferences){
        fillInForm(preferences);
    });
});
