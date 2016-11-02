/*
jshint esversion:6, jshint asi:true
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

let clearBtnFunction = function(event) {
	theController.myModel.root = undefined
	theController.myModel.currentSuite = undefined
	theController.myModel.asserts = []
	idGenerator = new idCounter();

	theController.updateDisplay()
	idGenerator = new idCounter();
}

for (var btn of clearBtns){
	btn.onclick = clearBtnFunction
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
	if (value === "not"){
		var z = theController.myModel.find(e.parentElement.id)
		z.notSelected()
	}
	else{
		var z = theController.myModel.find(e.parentElement.id)
		if (e.id.substr(e.id.length -2) == "d1"){
			z.dropdownSelected(value, true)
		}
		else z.dropdownSelected(value, false)
	}
}

function allowDrop(ev) {
    ev.preventDefault()
}

function drag(ev) {
	if (!isDragging){
		console.log("drag start")
		isDragging = true
    ev.dataTransfer.setData("text", ev.target.id)
		this.createDropElements()
		console.log(ev.target.id)
	}
}

function createDropElements(){
	console.log("gg")
	let suites = document.getElementsByClassName("Suite")
	let specs = document.getElementsByClassName("Spec")
	let setups = document.getElementsByClassName("Setup")
	let asserts = document.getElementsByClassName("Assert")
	let miscs = document.getElementsByClassName("Misc")

	for (let i = 0; i < suites.length; i++){
		let div = document.createElement("DIV")
		div.className = "droptarget"
		suites[i].parentNode.insertBefore(div, suites[i].nextSibling)
		console.log(suites[i].parentNode)
	}
	for (let i = 0; i < specs.length; i++){
		let div = document.createElement("DIV")
		div.className = "droptarget"
		specs[i].parentNode.insertBefore(div, specs[i].nextSibling)
	}
	for (let i = 0; i < setups.length; i++){
		let div = document.createElement("DIV")
		div.className = "droptarget"
		setups[i].parentNode.insertBefore(div, setups[i].nextSibling)
	}
	for (let i = 0; i < asserts.length; i++){
		let div = document.createElement("DIV")
		div.className = "droptarget"
		asserts[i].parentNode.insertBefore(div, asserts[i].nextSibling)
	}
	for (let i = 0; i < miscs.length; i++){
		let div = document.createElement("DIV")
		div.className = "droptarget"
		miscs[i].parentNode.insertBefore(div, miscs[i].nextSibling)
	}
}

function dragEndCheck(ev){
	console.log("drag end check" )
	this.isDragging = false
	this.drop(ev)
	ev.preventDefault()
	this.theController.updateDisplay()
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

function findIndexOfNode(node){
  let i = 1
  let prev
  while (true)
      if (prev = node.previousElementSibling) {
          node = prev
					if (node.nodeType === 1 && (this.id || this.className == "droptarget")) {
							++i
					}
      }
			else if (node = node.previousSibling) {
          if (node.nodeType === 1 && (this.id || this.className == "droptarget")) {
              ++i
          }
      }
			else {
				break
			}
  return i
}

function drop(ev) {
	if (isDragging){
			console.log("dropped")
		isDragging = false
		console.log(ev.target.nodeName)
  	let data = ev.dataTransfer.getData("text");
		if (ev.target.className == "droptarget") {
			theController.updateTestItem(ev.target.parentNode.id, data, this.findIndexOfNode(ev.target))
			console.log("a")
		}else if (ev.target.nodeName == "INPUT" || ev.target.nodeName == "TEXTAREA" || ev.target.nodeName == "BUTTON"){
			theController.updateTestItem(ev.target.parentNode.parentNode.id, data)
						console.log("b")
		}else{
			theController.updateTestItem(ev.target.id, data)
						console.log("c")

		}
	}
}

window.onkeypress = function(e) {
    if (e.key == 'ArrowDown') {
		console.log('down!')
		console.log(theController.myView.inputs)
		console.log(e.target.id)
		let newIndex = theController.myView.inputs.findIndex(x => x.id == e.target.id)+1
		if (newIndex < theController.myView.inputs.length) theController.myView.inputs[newIndex].focus()
		else window.scrollTo(0,document.body.scrollHeight);
		e.preventDefault();
    }
	else if (e.key == 'ArrowUp') {
		console.log('down!')
		console.log(theController.myView.inputs)
		console.log(e.target.id)
		let newIndex = theController.myView.inputs.findIndex(x => x.id == e.target.id)-1
		if (newIndex >= 0)  theController.myView.inputs[newIndex].focus()
		else window.scrollTo(0,0);
		e.preventDefault();
	}
};

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
