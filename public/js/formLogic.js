var reader = new FileReader();
var readerResult;

function previewFile(input) {
    if(input.files && input.files[0]) {
        reader.onload = function() {
            var previewImage = $("<img width = '100%' height = 'auto'>");
            previewImage.attr("src", reader.result);
            $(".imgPlace").empty();
            $(".imgPlace").append(previewImage);
            readerResult=reader.result;
        };

    reader.readAsDataURL(input.files[0]);
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
	   var gender=$("#genderBar option:selected").val();
	   var age=$("#ageInput").val();
	   var primaryLocation=$("#location").val();
        
        var bio=$("#bio").val();


    	var newForm = {
    	name: name,
        gender: gender,
        age: age,
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
        hockey: $("#hocket").is(":checked"),
        ice: $("#ice").is(":checked"),
        skateboard: $("#skateboard").is(":checked"),
        bio: bio
    	};

        console.log(newForm.run);

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
	});
});
