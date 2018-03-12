$(document).ready(function(){	

	$("#formSubmit").on("click", function(){

	var name=$("firstName").val();
	var gender=$("#genderBar option:selected").val();
	var age=$("#ageInput").val();
	var primaryLocation=$("#location").val();

	var activities=[weightlift, run, walk, swim, surf, bike, yoga, pilates, cardio, dance, rock, gymnastics, bowl, rowing, tennis, baseball,
    basketball, football, soccer, rugby, volleyball, golf, hockey, ice, skateboard];

    for (i=0;i<activities.length;i++){
    	
    	if($('input.activity').is('checked')){
    		var activities[i]=true;
    	}
    	else {
    		var activities[i]=true;
    	}

    }

	var newForm = {
	mainid: mainid,
	name: name,
    gender: gender,
    age: age,
    img: img,
    primaryLocation: primaryLocation,
    weightlift: weightlift,
    run: run,
    walk: walk,
    swim: swim,
    surf: surf,
    bike: bike,
    yoga: yoga,
    pilates: pilates,
    cardio: cardio,
    dance: dance,
    rock: rock,
    gymnastics: gymnastics,
    bowl: bowl,
    rowing: rowing,
    tennis: tennis,
    baseball: baseball,
    basketball: basketball,
    football: football,
    soccer: soccer,
    rugby: rugby,
    volleyball: volleyball,
    golf: golf,
    hockey: hockey,
    ice: ice,
    skateboard: skateboard,
    maxpress: maxpress,
    maxsquat: maxsquat,
    miles: miles,
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
	});
});
