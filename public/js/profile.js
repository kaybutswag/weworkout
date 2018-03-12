var expanded = false;
var reader = new FileReader();

function showCheckboxes() {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}

function clearContents(element) {
  element.value = '';
}

function previewFile(input) {
	if(input.files && input.files[0]) {
		reader.onload = function() {
			var previewImage = $("<img width = '100%' height = 'auto'>");
			previewImage.attr("src", reader.result);
			$(".imgPlace").empty();
			$(".imgPlace").append(previewImage);
		};

	reader.readAsDataURL(input.files[0]);
	}
}

$(document).ready(function(){
	$("#logout").on("click", function(){
		$.ajax({
			method: "GET",
			url: "/logout"
		}).then(function(data){
			window.location.reload();
		});
	});

	$("input[name=picture]").change(function(){
		$(".imgPlace").empty();
		previewFile(this);
	});
});