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

// Get the modal
var modal = document.getElementById('myModal')

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0]

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none"
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}