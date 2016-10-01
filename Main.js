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

var clearBtns = document.getElementsByClassName("clearBtn")
var saveBtns = document.getElementsByClassName("saveBtn")
var loadBtns = document.getElementsByClassName("loadBtn")

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

var newRootBtn = document.getElementById("newRootBtn")
newRootBtn.onclick = function() {
    modal.style.display = "Block"
	modal_content.setNewRootSuite()
}

var modal = document.getElementById('myModal')
var modalCloseBtn = document.getElementsByClassName("close")[0]
modalCloseBtn.onclick = function() {
    modal.style.display = "none"
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}