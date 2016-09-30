/*
jshint esversion:6
*/
/*
jshint asi:true
*/

//Fix dependancies in the code on TC
var SELECTEDSUITE = ""
var NEWTYPE = ""
var currentItem
var TC = new Controller()
TC.loadTestData()
TC.updateDisplay()

//Add onclicks for all add specs

var modalDescr = document.getElementById("modalDescription")
var modalAddBtn = document.getElementById("modalAddBtn")
var clearBtns = document.getElementsByClassName("clearBtn")
var saveBtns = document.getElementsByClassName("saveBtn")
var loadBtns = document.getElementsByClassName("loadBtn")

modalAddBtn.onclick = function(event) {
    if (currentItem.type === "Suite"){
		TC.myModel.setCurrentSuite(currentItem)
		if (NEWTYPE === "SPEC"){
			TC.myModel.addSpec(modalDescr.value)
			TC.updateDisplay()
			modal.style.display = "none"
			modalDescr.value = ""
		}
		else if (NEWTYPE === "SUITE"){
			TC.myModel.addSuite(modalDescr.value)
			TC.updateDisplay()
			modal.style.display = "none"
			modalDescr.value = ""
		}
	}
}

for (var btn of clearBtns){
	btn.onclick = function(event) {
		TC.myModel.root = undefined
		TC.updateDisplay()
	}
}

for (var btn of saveBtns){
	btn.onclick = function(event) {
		alert("Save button not working yet")
	}
}

for (var btn of loadBtns){
	btn.onclick = function(event) {
		alert("Load button not working yet")
	}
}

// Get the modal
var modal = document.getElementById('myModal')

// Modal close button
var span = document.getElementsByClassName("close")[0]
// close the modal on click 
span.onclick = function() {
    modal.style.display = "none"
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}