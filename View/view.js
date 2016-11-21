/*jshint esversion:6, asi:true, unused:false*/
/*globals theController:true, idGenerator:true, idCounter, modal_content, toast_msg, Controller*/
/**
* HTMLView
*
* @class HTMLView
* @constructor
*/
class HTMLView{
	/**
	* Class Constructor
	*
	* @method Constructor
	* @param {Controller} newController
	*/
	constructor(newController){
		console.log("view")
		this.controller = newController
		this.inputs = []
		this.errorElements = []
		this.errorElementIndex = 0
		this.modal = undefined
		this.currentItem = undefined
		this.isMouseDown = false
		this.contextTarget = undefined
		this.hoveredItem = undefined
		this.lastElem
		this.initialise()
	}

	/**
	* Gets buttons and sets onclicks
	*
	* @method initialise
	*/
	initialise(){
		//Sets many on click methods
		var clearBtns = document.getElementsByClassName("clearBtn")
		var saveBtns = document.getElementsByClassName("saveBtn")
		var loadBtns = document.getElementsByClassName("loadBtn")
		var helpBtns = document.getElementsByClassName("helpBtn")
		var ctxCopy = document.getElementById("ctxCopy")
		var ctxCut = document.getElementById("ctxCut")
		var ctxClone = document.getElementById("ctxClone")
		var ctxDelete = document.getElementById("ctxDelete")
		this.errorElements = document.getElementsByClassName("error")

		let clearBtnFunction = function(event) {
			theController.myModel.root = undefined
			theController.myModel.currentSuite = undefined
			theController.myModel.asserts = []
			theController.updateDisplay()
			idGenerator = new idCounter()
		}

		for (let btn of clearBtns){
			btn.onclick = clearBtnFunction
		}

    	let saveFunc = function(event) {
				modal_content.setSave()
				theController.myView.modal.style.display = "block"
		}

		for (let btn of saveBtns){
			btn.onclick = saveFunc
		}

    	let loadFunc = function(event) {
				document.getElementById("fileSelector").click()
		}

		for (let btn of loadBtns){
			btn.onclick = loadFunc
		}

    	let helpFunc = function(event) {
				modal_content.setHelp()
				theController.myView.modal.style.display = "block"
		}

		for (let btn of helpBtns){
			btn.onclick = helpFunc
		}

		ctxCopy.onclick = function(event) {
			if (theController.myModel.selected.length === 0){
				toast_msg.showNoneSelected()
				return
			}
			else{
				theController.myModel.copiedItems = theController.myModel.selected
				toast_msg.showCopy()
			}
		}

		ctxCut.onclick = function(event) {
			if (theController.myModel.selected.length === 0){
				toast_msg.showNoneSelected()
				return
			}
			else{
				theController.myModel.copiedItems = []
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
					if (i.type === "Assert"){
						let doesExist = theController.myModel.asserts.findIndex(x => x.id == i.id)
						if (doesExist != -1){
							theController.myModel.asserts.splice(doesExist, 1)
						}
					}
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
				idGenerator = new idCounter()
				theController.updateDisplay()
				toast_msg.showDeleted()
				return
			}
			for (var i of currentItems){
				let index = i.parent.allMyChildren.findIndex(x => x.id == i.id)
				i.parent.removeChild(index)
				if (i.type === "Assert"){
					let doesExist = theController.myModel.asserts.findIndex(x => x.id == i.id)
					if (doesExist != -1){
						theController.myModel.asserts.splice(doesExist, 1)
					}
				}
			}
			theController.updateDisplay()
			toast_msg.showDeleted()
		}

		var newRootBtn = document.getElementById("newRootBtn")
		newRootBtn.onclick = function() {
		    theController.myView.modal.style.display = "Block"
			modal_content.setNewRootSuite()
			document.getElementById("modalDescription").focus()
		}

		this.modal = document.getElementById('myModal')
		var modalCloseBtn = document.getElementsByClassName("close")[0]
		modalCloseBtn.onclick = function() {
		    theController.myView.modal.style.display = "none"
		}

		document.getElementById("fileSelector").addEventListener("change", function() {
		    theController = new Controller()
			idGenerator = new idCounter()
			theController.loadFromFile()
		})
	}

	/**
	* Resets view html
	*
	* @method cleanView
	*/
	cleanView(){
		document.getElementById('main').innerHTML = ""
	}

	/**
	* Sets item click listeners
	*
	* @method setItemClickListeners
	*/
	setItemClickListeners(elementID){
		var theElement = document.getElementById(elementID)
		theElement.addEventListener('click', function(e) {
			var ctxMenu = document.getElementById("ctxMenu")
			ctxMenu.style.display = ""
			ctxMenu.style.left = ""
			ctxMenu.style.top = ""
			var ctxMenu2 = document.getElementById("ctx2")
			ctxMenu2.style.display = "none"
			ctxMenu2.style.left = "0"
			ctxMenu2.style.top = "0"
			if (e.ctrlKey) {
				theController.myModel.selectItem(theController.myModel.find(e.target.id))
			}
			e.stopPropagation()
		})

		theElement.addEventListener("contextmenu",function(event){
			if (event.ctrlKey) {
				event.preventDefault()
				var ctxMenu = document.getElementById("ctxMenu")
				ctxMenu.style.display = "block"
				ctxMenu.style.left = (event.pageX - 10)+"px"
				ctxMenu.style.top = (event.pageY - 10)+"px"
				return
			}
			if (event.target.classList.contains("TestItem")) {
				event.preventDefault()
				let ctxHeight
				var ctxMenu2 = document.getElementById("ctx2")
				if (event.target.classList.contains("Suite")){
					set_context.setCtx1Suite(event.target.id)
					ctxHeight = 440
					if (event.target.id === "Item0") ctxHeight -= 88
				}
				else if (event.target.classList.contains("Spec")){
					set_context.setCtx1Spec(event.target.id)
					ctxHeight = 308
				}
				else if (event.target.classList.contains("Assert")){
					set_context.setCtx1Assert(event.target.id)
					ctxHeight = 132
				}
				else if (event.target.classList.contains("Misc")){
					set_context.setCtx1Code(event.target.id)
					ctxHeight = 132
				}
				else if (event.target.classList.contains("Setup")){
					set_context.setCtx1Setup(event.target.id)
					ctxHeight = 220
				}
				else ctxHeight = 0
				let distanceFromBottom = window.innerHeight - event.clientY

				if((distanceFromBottom - ctxHeight)>0){
					ctxMenu2.style.left = (event.pageX - 1)+"px"
					ctxMenu2.style.top = (event.pageY - 1)+"px"
					ctxMenu2.style.display = "block"
				}
				else{
					ctxMenu2.style.left = (event.pageX - 1 )+"px"
					ctxMenu2.style.top = (event.pageY - 1 - ctxHeight)+"px"
					ctxMenu2.style.display = "block"
				}
				console.log((distanceFromBottom - ctxHeight))
				console.log((distanceFromBottom - ctxHeight)>0)
			}
		},false)
	}

	/**
	* Loads assert dropdown
	*
	* @method assertDropdown
	*/
	assertDropdown(e){
		let value = e.value
		if (value === "not"){
			let assert = theController.myModel.find(e.parentElement.id)
			assert.notSelected()
		}
		else{
			let assert = theController.myModel.find(e.parentElement.id)
			if (e.id.substr(e.id.length -2) == "d1"){
				assert.dropdownSelected(value, true)
			}
			else assert.dropdownSelected(value, false)
		}
	}

	/**
	* Changes background color of an item
	*
	* @method changeItemBackground
	* @param {string} theElementId
	*/
	changeItemBackground(theElementId){
		document.getElementById(theElementId).style.backgroundColor = '#B0D9D5'
	}

	/**
	* Resets background color of an item
	*
	* @method resetItemBackground
	* @param {string} theElementId
	*/
	resetItemBackground(theElementId){
		if (theElementId.substr(0, 4) === "Item"){
			let backColour = 240 - (theController.myModel.find(theElementId).findIndent() * 20)
			if(theController.myModel.find(theElementId))
			document.getElementById(theElementId).style.backgroundColor = "rgb("+backColour+", "+backColour+", "+backColour+")"
		}
	}

	/**
	* Appends content to specified div
	*
	* @method appendToDiv
	* @param {string} divID
	* @param {string} content
	*/
	appendToDiv(divID, content){
		var HTMLdiv = document.getElementById(divID)
		HTMLdiv.innerHTML += content
	}

	/**
	* Changes a divs innerhtml to specified content
	*
	* @method setToDiv
	* @param {string} divID
	* @param {string} textContent
	*/
	setToDiv(divID, textContent){
		var HTMLdiv = document.getElementById(divID)
		HTMLdiv.innerHTML = textContent
	}

	/**
	* event to allowDrop
	*
	* @method allowDrop
	*/
	allowDrop(ev) {
		ev.preventDefault()
	}

	/**
	* Creates drop elements and sets data transfer of dragged element
	*
	* @method drag
	* @param {Event} ev
	*/
	drag(ev) {
		if (this.lastElem != ev.target){
			this.lastElem = ev.target
			ev.dataTransfer.setData("text", ev.target.id)
			this.createDropElements()
		}
	}

	/**
	* Creates drop elements
	*
	* @method createDropElements
	*/
	createDropElements(){
  	let suites = document.getElementsByClassName("Suite")
  	let specs = document.getElementsByClassName("Spec")
  	let setups = document.getElementsByClassName("Setup")
  	let asserts = document.getElementsByClassName("Assert")
  	let miscs = document.getElementsByClassName("Misc")
		let inputs = document.getElementsByClassName("input")
		let setupNames = document.getElementsByClassName("setupName")

		let onEnterFunc = function(e){
			e.target.style.background = 'green'
		}
		let onLeaveFunc = function(e){
			e.target.style.background = 'black'
		}
		for (let input of inputs){
			if (input.parentNode.classList.contains("Suite") || input.parentNode.classList.contains("Spec")){
				input.style.marginBottom = '24.5px'
			}
		}
		for (let name of setupNames){
			name.style.marginBottom = '26.5px'
		}
		for (let misc of miscs){
			let div = document.createElement("DIV")
			div.className = "droptarget"
			div.ondragover = onEnterFunc
			div.ondragleave = onLeaveFunc

			misc.parentNode.insertBefore(div, misc.nextSibling)
			misc.style.marginBottom = 0
			misc.style.marginTop = 0
		}

  	for (let i = 0; i < suites.length; i++){
			if (i!== 0){
				let div = document.createElement("DIV")
				div.className = "droptarget"
				div.ondragover = onEnterFunc
				div.ondragleave = onLeaveFunc
				suites[i].parentNode.insertBefore(div, suites[i].nextSibling)
				suites[i].style.marginBottom = 0
				suites[i].style.marginTop = 0
			}
  	}
  	for (let spec of specs){
			let div = document.createElement("DIV")
			div.className = "droptarget"
			div.ondragover = onEnterFunc
			div.ondragleave = onLeaveFunc

			spec.parentNode.insertBefore(div, spec.nextSibling)
			spec.style.marginBottom = 0
			spec.style.marginTop = 0

  	}
  	for (let setup of setups){
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

	/**
	* Checks if drag has ended
	*
	* @method dragEndCheck
	* @param {Event} ev
	*/
	dragEndCheck(ev){
		theController.updateDisplay()
	}

	/**
	* changes swaps setting for all other items if mouse is down
	*
	* @method changeDrag
	* @param {boolean} dragSetting
	* @param {boolean} mouseSetting
	*/
	changeDrag(dragSetting, mouseSetting = undefined) {
		if (mouseSetting !== undefined || this.isMouseDown){
			let suites = document.getElementsByClassName("TestItem")
			let specs = document.getElementsByClassName("Spec")
			let setups = document.getElementsByClassName("Setup")
			let asserts = document.getElementsByClassName("Assert")
			let miscs = document.getElementsByClassName("Misc")

			for (let suite of suites){
				suite.draggable = dragSetting
			}
			for (let spec of specs){
				spec.draggable = dragSetting
			}
			for (let setup of setups){
				setup.draggable = dragSetting
			}
			for (let assert of asserts){
				assert.draggable = dragSetting
			}
			for (let misc of miscs){
				misc.draggable = dragSetting
			}
		}
		if (mouseSetting !== undefined){
			this.isMouseDown = mouseSetting
		}
  }

	/**
	* Finds the index of a node in its parent
	*
	* @method findIndexOfNode
	* @param {element} node
	* @return {int} index
	*/
  findIndexOfNode(node){
	let index = 0
    while ( (node = node.previousSibling) ) {
      if (node.tagName == "DIV") {
		if (node.classList.contains("droptarget") || node.classList.contains("TestItem")){
  			index++
		}
      }
    }
    return index
  }

	/**
	* Moves the test item to the dropped location
	*
	* @method drop
	* @param {event} ev
	*/
	drop(ev) {
		ev.preventDefault()
		this.isDragging = false
		let data = ev.dataTransfer.getData("text")
		let incorrectDropElements = ["INPUT", "TEXTAREA", "BUTTON", "SELECT", "SPAN"]
		let draggedElement = document.getElementById(data)
		if (ev.target.className == "droptarget") {
			// 1 is deducted from the droptarget as it offsets the correct index
			if(ev.target.parentNode != draggedElement.parentNode || this.findIndexOfNode(ev.target) - 1 != this.findIndexOfNode(draggedElement)) {
				theController.updateTestItem(ev.target.parentNode.id, data, this.findIndexOfNode(ev.target))
			}
		}else if (this.checkForIncorrectDropElement(incorrectDropElements, ev.target.nodeName)){
			if(ev.target.parentNode.id != data) {
				theController.updateTestItem(ev.target.parentNode.id, data)
			}
		}else{
			theController.updateTestItem(ev.target.id, data)
		}
	}

	/**
	* Moves the test item to the dropped location
	*
	* @method checkForIncorrectDropElement
	* @param {array} elementTypes
	* @param {string} targetElementType
	* @return {boolean} compatible
	*/
	checkForIncorrectDropElement(elementTypes, targetElementType) {
		for (let elementType of elementTypes){
			if (elementType == targetElementType){
				console.log(elementType == targetElementType)
				return true
			}
		}
		return false
	}
}

//update model when inputs are changed
window.addEventListener('input', function (e) {
	let identifier = e.target.id.substr(e.target.id.length -2)
	if (e.target.id.substr(0, 4) === "Item"){
		console.log(1)
		if (identifier === "t1" ){
			console.log(2)
			let id = e.target.id.slice(0, -2)
			console.log(id)
			let item = theController.myModel.find(id)
			console.log(item)
			if (item.type === "Assert"){
				console.log(3)
				item.content = e.target.value
				console.log(item)
			}
			return
		}
		else if (identifier === "t2"){
			console.log(2)
			let id = e.target.id.slice(0, -2)
			console.log(id)
			let item = theController.myModel.find(id)
			console.log(item)
			if (item.type === "Assert"){
				console.log(3)
				item.content2 = e.target.value
				console.log(item)
			}
			return
		}
		//ignore dropdowns
		if (identifier === "d1" || identifier === "d2") return
		let id = e.target.id.slice(0, -1)
		console.log(theController.myModel.find(id))
		theController.myModel.updateItem(id, e.target.value)
	}
 }, false)

window.onkeypress = function(e) {
    if (e.key == 'ArrowDown') {
		if(e.target.type === "textarea"){
			if(e.target.value.substr(0, e.target.selectionEnd).split("\n").length === e.target.value.split("\n").length){
				if(e.target.selectionStart === e.target.value.length){
					let newIndex = theController.myView.inputs.findIndex(x => x.id == e.target.id)+1
					if (newIndex < theController.myView.inputs.length)theController.myView.inputs[newIndex].focus()
				}else{
					e.target.selectionStart = e.target.value.length
					e.target.selectionEnd = e.target.value.length
				}
				e.preventDefault()
				return
			}
			else return
		}
		let newIndex = theController.myView.inputs.findIndex(x => x.id == e.target.id)+1
		if (newIndex < theController.myView.inputs.length) theController.myView.inputs[newIndex].focus()
		else window.scrollTo(0,document.body.scrollHeight)
		e.preventDefault()
    }
 	else if (e.key == 'ArrowUp') {
		if(e.target.type === "textarea"){
			if(e.target.value.substr(0, e.target.selectionEnd).split("\n").length === 1){
				if(e.target.selectionEnd === 0){
					let newIndex = theController.myView.inputs.findIndex(x => x.id == e.target.id)-1
					if (newIndex < theController.myView.inputs.length) theController.myView.inputs[newIndex].focus()
				}
				else{
					e.target.selectionStart = 0
					e.target.selectionEnd = 0
				}
				e.preventDefault()
				return
			}
			else return
		}
 		let newIndex = theController.myView.inputs.findIndex(x => x.id == e.target.id)-1
 		if (newIndex >= 0)  theController.myView.inputs[newIndex].focus()
 		else window.scrollTo(0,0)
 		e.preventDefault()
 	}
 }

function hideContext(e){
	if (e.target.className === "ctxItem"){
		return
	}
	var ctxMenu2 = document.getElementById("ctx2")
	ctxMenu2.style.display = "none"
}

 window.addEventListener("mousedown", hideContext)

 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
     if (event.target == theController.myView.modal) {
         theController.myView.modal.style.display = "none"
     }
 	var ctxMenu = document.getElementById("ctxMenu")
 	ctxMenu.style.display = "none"
 	ctxMenu.style.left = "0"
 	ctxMenu.style.top = "0"
	var ctxMenu2 = document.getElementById("ctx2")
 	ctxMenu2.style.display = "none"
 	ctxMenu2.style.left = "0"
 	ctxMenu2.style.top = "0"
 }
