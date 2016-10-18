/*
jshint esversion:6
*/
/*
jshint asi:true
*/

//Fix dependancies in the code on theController?
var SELECTEDSUITE = ""
var NEWTYPE = ""
var currentItem
var theController = new Controller()
theController.loadTestData()
theController.updateDisplay()

//buttons at the top
var clearBtns = document.getElementsByClassName("clearBtn")
var saveBtns = document.getElementsByClassName("saveBtn")
var loadBtns = document.getElementsByClassName("loadBtn")
var helpBtns = document.getElementsByClassName("helpBtn")

for (var btn of clearBtns){
	btn.onclick = function(event) {
		theController.myModel.root = undefined
		theController.updateDisplay()
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

	}
}

for (var btn of helpBtns){
	btn.onclick = function(event) {
		modal_content.setHelp()
		modal.style.display = "block"
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
    theController = new Controller()
	idGenerator = new idCounter();
	theController.loadFromFile()
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {

    ev.dataTransfer.setData("text", ev.target.id);
		console.log(ev.target.id)
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}
