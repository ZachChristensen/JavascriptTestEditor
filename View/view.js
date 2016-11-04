/*jshint esversion:6, asi:true, unused:false*/
/*globals theController:true, idGenerator:true, idCounter, modal_content, toast_msg, Controller*/

class HTMLView{
	constructor(newController){
		console.log("view")
		this.controller = newController
		this.inputs = []
		this.errorElements = []
		this.errorElementIndex = 0
		this.modal = undefined
		this.currentItem = undefined
		this.isDragging = false
		this.isMouseDown = false
		this.initialise()
	}

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
			idGenerator = new idCounter();

			theController.updateDisplay()
			idGenerator = new idCounter();
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
				document.getElementById("fileSelector").click();
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
        let findIndexOfChild = i.parent.allMyChildren.findIndex(x => x.id == i.id)
				for (var i of currentItems){
					let index = findIndexOfChild
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
      let findIndexOfChild = i.parent.allMyChildren.findIndex(x => x.id == i.id)
			for (var i of currentItems){
				let index = findIndexOfChild
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
      let findIndexOfChild = i.parent.allMyChildren.findIndex(x => x.id == i.id)
			for (var i of currentItems){
				let index = findIndexOfChild
				i.parent.removeChild(index)
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
			idGenerator = new idCounter();
			theController.loadFromFile()
		})
	}

	cleanView(){
		document.getElementById('main').innerHTML = ""
	}

	setItemClickListeners(elementID){
		var theElement = document.getElementById(elementID)
		theElement.addEventListener('click', function(e) {
			var ctxMenu = document.getElementById("ctxMenu");
			ctxMenu.style.display = "";
			ctxMenu.style.left = "";
			ctxMenu.style.top = "";
			if (e.ctrlKey) {
				theController.myModel.selectItem(theController.myModel.find(e.target.id))
				e.stopPropagation()
			}
		});

		theElement.addEventListener("contextmenu",function(event){
			if (event.ctrlKey) {
				event.preventDefault();
				var ctxMenu = document.getElementById("ctxMenu");
				ctxMenu.style.display = "block";
				ctxMenu.style.left = (event.pageX - 10)+"px";
				ctxMenu.style.top = (event.pageY - 10)+"px";
				return
			}
			if (event.target.className !== "input") {
				//event.preventDefault();
			}
		},false);
	}

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

	changeItemBackground(theElementId){
		document.getElementById(theElementId).style.backgroundColor = '#9DD'
	}

	resetItemBackground(theElementId){
		let backColour = 240 - (theController.myModel.find(theElementId).findIndent() * 20)
		document.getElementById(theElementId).style.backgroundColor = "rgb("+backColour+", "+backColour+", "+backColour+")"
	}

	appendToDiv(divID, textContent){
		var HTMLdiv = document.getElementById(divID)
		HTMLdiv.innerHTML += textContent
	}

	setToDiv(divID, textContent){
		var HTMLdiv = document.getElementById(divID)
		HTMLdiv.innerHTML = textContent
	}


	allowDrop(ev) {
		ev.preventDefault()
	}

	drag(ev) {
		if (!this.isDragging){
			console.log("drag start")
			this.isDragging = true
			ev.dataTransfer.setData("text", ev.target.id)
			this.createDropElements()
			console.log(ev.target.id)
		}
	}

	createDropElements(){
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
		for (let input of inputs){
			if (input.parentNode.classList.contains("Suite") || input.parentNode.classList.contains("Spec")){
			  input.style.marginTop = '8px'
			  input.style.marginBottom = '24.5px'
			}
		}
		for (let btn of setupBtns){
			btn.style.marginBottom = '1em'
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

	  	for (let suite of suites){
	  		let div = document.createElement("DIV")
	  		div.className = "droptarget"
	        div.ondragover = onEnterFunc
	        div.ondragleave = onLeaveFunc
			suite.parentNode.insertBefore(div, suite.nextSibling)
	        suite.style.marginBottom = 0
	        suite.style.marginTop = 0
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

	dragEndCheck(ev){
		console.log("drag end check" )
		this.isDragging = false
		this.drop(ev)
		ev.preventDefault()
		theController.updateDisplay()
	}

	changeDrag(dragSetting, mouseSetting = undefined) {
		console.log("Drag setting: " + dragSetting + " - Mouse down: " + mouseSetting)
		if (mouseSetting !== undefined || this.isMouseDown){
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
		if (mouseSetting !== undefined){
			this.isMouseDown = mouseSetting
		}
  }

  findIndexOfNode(node){
	let index = 1
    while ( (node = node.previousSibling) ) {
        if (node.tagName == "DIV") {
			if (node.classList.contains("droptarget")) {
				console.log(node.className)
            	index++
			}
        }
    }
    return index
  }

  drop(ev) {
   if (this.isDragging){
  		 console.log("dropped")
  	 this.isDragging = false
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
				item.contents = e.target.value
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
				item.contents2 = e.target.value
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
 }, false);

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
			else{
				return
			}
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
			else{
				return
			}
		}
 		let newIndex = theController.myView.inputs.findIndex(x => x.id == e.target.id)-1
 		if (newIndex >= 0)  theController.myView.inputs[newIndex].focus()
 		else window.scrollTo(0,0)
 		e.preventDefault()
 	}
 }

 // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == theController.myView.modal) {
		theController.myView.modal.style.display = "none"
	}
	var ctxMenu = document.getElementById("ctxMenu")
	ctxMenu.style.display = "none"
	ctxMenu.style.left = "0"
	ctxMenu.style.top = "0"
}
