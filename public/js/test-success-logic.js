$("#logout").on("click", function(){
	$.ajax({
		method: "GET",
		url: "/logout"
	}).then(function(data){
		window.location.reload();
	});
})