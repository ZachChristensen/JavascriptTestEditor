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
var isDragging = false
theController.loadTestData()
theController.updateDisplay()

//buttons at the top
var clearBtns = document.getElementsByClassName("clearBtn")
var saveBtns = document.getElementsByClassName("saveBtn")
var loadBtns = document.getElementsByClassName("loadBtn")
var helpBtns = document.getElementsByClassName("helpBtn")
var ctxCopy = document.getElementById("ctxCopy")
var ctxCut = document.getElementById("ctxCut")
var ctxClone = document.getElementById("ctxClone")


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

ctxCopy.onclick = function(event) {
	if (theController.myModel.selected.length === 0){
		toast_msg.showNoneSelected()
		return
	}
	else{
		theController.myModel.setCopiedItems(theController.myModel.selected)
		toast_msg.showCopy()
	}
}

ctxCut.onclick = function(event) {
	if (theController.myModel.selected.length === 0){
		toast_msg.showNoneSelected()
		return
	}
	else{
		let currentItems = theController.myModel.selected
		for (var i of currentItems){
			let index = i.parent.allMyChildren.findIndex(x => x.id == i.id)
			let parent = i.parent
			theController.myModel.addCopiedItem(i)
			parent.removeChild(index)
		}
		theController.updateDisplay()
		toast_msg.showCut()
	}
}

ctxClone.onclick = function(event) {
	if (theController.myModel.selected.length === 0){
		toast_msg.showNoneSelected()
		return
	}
	let currentItems = theController.myModel.selected
	for (var i of currentItems){
		let index = i.parent.allMyChildren.findIndex(x => x.id == i.id)
		i.parent.cloneChild(index, false)
	}
	toast_msg.showClone()
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
})

function assertDropdown(e){
	var value = e.value
	if (value === ".not"){
		console.log("not!")
		
		var z = theController.myModel.find(e.parentElement.id)
		console.log(z)
		z.notSelected()
	}
	else{
		var z = theController.myModel.find(e.parentElement.id)
		console.log(z)
		console.log(e.id)
		if (e.id.substr(5,2) == "d1"){
			z.dropdownSelected(value, true)
		}
		else z.dropdownSelected(value, false)
	}
	console.log(value)
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
	if (!isDragging){
		isDragging = true
    ev.dataTransfer.setData("text", ev.target.id);
		console.log(ev.target.id)
	}
}

function drop(ev) {
	if (isDragging){
		isDragging = false
  	ev.preventDefault();
  	var data = ev.dataTransfer.getData("text");
		theController.updateTestItem(ev.target.id, data)
	}
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
	var ctxMenu = document.getElementById("ctxMenu");
	ctxMenu.style.display = "";
	ctxMenu.style.left = "";
	ctxMenu.style.top = "";
}
