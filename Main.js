/*
jshint esversion:6, jshint asi:true
*/

var currentItem
var isDragging = false
var isMouseDown = false

var theController = new Controller()
theController.loadTestData()
theController.updateDisplay()

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
  	let data = ev.dataTransfer.getData("text")
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
