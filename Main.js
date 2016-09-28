/*
jshint esversion:6
*/
/*
jshint asi:true
*/

//Fix dependancies in the code on TC
var SELECTEDSUITE = ""
var TC = new Controller()
TC.loadTestData()
TC.updateDisplay()

//Add onclicks for all add specs
var specbtns = document.getElementsByClassName("btnAddSpec")
var modalDescr = document.getElementById("modalDescription")
var modalAddBtn = document.getElementById("modalAddBtn")

modalAddBtn.onclick = function(event) {
    if (currentItem.type === "Suite"){
		TC.myModel.setCurrentSuite(currentItem)
		TC.myModel.addSpec(modalDescr.innerHTML)
		TC.myModel.toHTML()
	}
}

for (var spec of specbtns){
	spec.onclick = function(event) {
		SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
		currentItem = TC.myModel.find(SELECTEDSUITE)
		document.getElementById('modalTitle').innerHTML = "Add " + currentItem.type
		modal.style.display = "block";
    }
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}