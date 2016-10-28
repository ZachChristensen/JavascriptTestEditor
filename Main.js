/*
jshint esversion:6
*/
/*
jshint asi:true
*/

var SELECTEDSUITE = ""
var NEWTYPE = ""
var currentItem
var theController = new Controller()
var isDragging = false
var isMouseDown = false
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
var ctxDelete = document.getElementById("ctxDelete")


for (var btn of clearBtns){
	btn.onclick = function(event) {
		theController.myModel.root = undefined
		theController.myModel.currentSuite = undefined
		theController.myModel.asserts = []
		idGenerator = new idCounter();

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
		if (currentItems[0].parent === "None"){
			toast_msg.show("Cannot cut root suite")
			return
		}
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
	if (currentItems[0].parent === "None"){
		toast_msg.show("Cannot clone root suite")
		return
	}
	for (var i of currentItems){
		let index = i.parent.allMyChildren.findIndex(x => x.id == i.id)
		i.parent.cloneChild(index, false)
	}
	toast_msg.showClone()
}

ctxDelete.onclick = function(event) {
	if (theController.myModel.selected.length === 0){
		toast_msg.showNoneSelected()
		return
	}
	let currentItems = theController.myModel.selected
	if (currentItems[0].parent === "None"){
		theController.myModel.root = undefined
		theController.myModel.currentSuite = undefined
		theController.myModel.asserts = []
		idGenerator = new idCounter();
		theController.updateDisplay()
		toast_msg.showDeleted()
		return
	}
	for (var i of currentItems){
		let index = i.parent.allMyChildren.findIndex(x => x.id == i.id)
		i.parent.removeChild(index)
	}
	theController.updateDisplay()
	toast_msg.showDeleted()
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
		var z = theController.myModel.find(e.parentElement.id)
		z.notSelected()
	}
	else{
		var z = theController.myModel.find(e.parentElement.id)
		if (e.id.substr(5,2) == "d1"){
			z.dropdownSelected(value, true)
		}
		else z.dropdownSelected(value, false)
	}
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

function changeDrag(dragSetting, mouseSetting = undefined) {
	console.log("Drag setting: " + dragSetting + " - Mouse down: " + mouseSetting)
	if (mouseSetting != undefined || this.isMouseDown){
		let suites = document.getElementsByClassName("Suite")
		let specs = document.getElementsByClassName("Spec")
		let setups = document.getElementsByClassName("Setup")
		let asserts = document.getElementsByClassName("Assert")
		let miscs = document.getElementsByClassName("Misc")

		for (let i = 0; i < suites.length; i++){
			suites[i].draggable = dragSetting
		}
		for (let i = 0; i < specs.length; i++){
			specs[i].draggable = dragSetting
		}
		for (let i = 0; i < setups.length; i++){
			setups[i].draggable = dragSetting
		}
		for (let i = 0; i < asserts.length; i++){
			asserts[i].draggable = dragSetting
		}
		for (let i = 0; i < miscs.length; i++){
			miscs[i].draggable = dragSetting
		}
		console.log("drag set to: " + dragSetting)
	}
	if (mouseSetting != undefined){
		this.isMouseDown = mouseSetting
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
