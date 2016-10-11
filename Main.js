/*
jshint esversion:6
*/
/*
jshint asi:true
*/

//Fix dependancies in the code on TC?
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
		idGenerator = new idCounter();
	}
}

for (var btn of saveBtns){
	btn.onclick = function(event) {
		modal_content.setSave()
		modal.style.display = "block"
	}
}

for (var btn of loadBtns){
	btn.onclick = function(event) {
		document.getElementById("fileSelector").click();
		idGenerator = new idCounter();
	}
}

var newRootBtn = document.getElementById("newRootBtn")
newRootBtn.onclick = function() {
    modal.style.display = "Block"
	modal_content.setNewRootSuite()
	document.getElementById("modalDescription").focus()
}

var modal = document.getElementById('myModal')
var modalCloseBtn = document.getElementsByClassName("close")[0]
modalCloseBtn.onclick = function() {
    modal.style.display = "none"
}

document.getElementById("fileSelector").addEventListener("change", function() {
	//terrible fix this
    TC = new Controller()
	TC.loadFromFile()
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}
