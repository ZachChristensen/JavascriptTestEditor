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
    let inputs = document.getElementsByClassName("input")
    let setupBtns = document.getElementsByClassName("setupBtn")
    let onEnterFunc = function(e){
        e.target.style.background = 'green'
    }
    let onLeaveFunc = function(e){
        e.target.style.background = 'black'
    }
    for (var input of inputs){
        if (input.parentNode.className === "Suite" || input.parentNode.className === "Spec"){
            input.style.marginBottom = '23px'
            input.style.marginBottom = '23px'
        }
    }
    for (var btn of setupBtns){
        btn.style.marginBottom = '1em'
    }
    for (var misc of miscs){
        let div = document.createElement("DIV")
        div.className = "droptarget"
        div.ondragover = onEnterFunc
        div.ondragleave = onLeaveFunc

        misc.parentNode.insertBefore(div, misc.nextSibling)
        misc.style.marginBottom = 0
        misc.style.marginTop = 0

    }
	for (var suite of suites){
		let div = document.createElement("DIV")
		div.className = "droptarget"
        div.ondragover = onEnterFunc
        div.ondragleave = onLeaveFunc
		suite.parentNode.insertBefore(div, suite.nextSibling)
        suite.style.marginBottom = 0
        suite.style.marginTop = 0
	}
	for (var spec of specs){
		let div = document.createElement("DIV")
		div.className = "droptarget"
        div.ondragover = onEnterFunc
        div.ondragleave = onLeaveFunc

		spec.parentNode.insertBefore(div, spec.nextSibling)
        spec.style.marginBottom = 0
        spec.style.marginTop = 0

	}
	for (var setup of setups){
		let div = document.createElement("DIV")
		div.className = "droptarget"
        div.ondragover = onEnterFunc
        div.ondragleave = onLeaveFunc

		setup.parentNode.insertBefore(div, setup.nextSibling)
        setup.style.marginBottom = 0
        setup.style.marginTop = 0

	}
	for (var assert of asserts){
		let div = document.createElement("DIV")
		div.className = "droptarget"
        div.ondragover = onEnterFunc
        div.ondragleave = onLeaveFunc

		assert.parentNode.insertBefore(div, assert.nextSibling)
        assert.style.marginBottom = 0
        assert.style.marginTop = 0
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
	//console.log("Drag setting: " + dragSetting + " - Mouse down: " + mouseSetting)
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
		//console.log("drag set to: " + dragSetting)
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
