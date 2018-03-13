var expanded = false;

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

$(document).ready(function(){
	$("#logout").on("click", function(){
		$.ajax({
			method: "GET",
			url: "/logout"
		}).then(function(data){
			window.location.reload();
		});
	});
});