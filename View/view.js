//VIEW

class HTMLView{
	constructor(newController){
		console.log("view")
		this.controller = newController
		this.inputs = []
		this.errorElements = []
		this.errorElementIndex = 0
		this.modal = undefined
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

		for (var btn of clearBtns){
			btn.onclick = clearBtnFunction
		}

		for (var btn of saveBtns){
			btn.onclick = function(event) {
				modal_content.setSave()
				theController.myView.modal.style.display = "block"
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
				theController.myView.modal.style.display = "block"
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

			}
			e.stopPropagation()
		});

		theElement.addEventListener("contextmenu",function(event){
			if (event.ctrlKey) {
				event.preventDefault();
				var ctxMenu = document.getElementById("ctxMenu");
				ctxMenu.style.display = "block";
				ctxMenu.style.left = (event.pageX - 10)+"px";
				ctxMenu.style.top = (event.pageY - 10)+"px";
			}
		},false);

		//Incomplete highlight on hover
		// theElement.addEventListener("mouseover", function( event ) {
			// if (event.target.className === "dropbtn" || event.target.className.slice(0,3) === "btn") return false
			// document.getElementById(event.target.id).style.backColour = "#AAA";
			    // setTimeout(function() {
					// event.target.style.backColour = "";
				// }, 500);
		// }, false);
	}

	assertDropdown(e){
		var value = e.value
		if (value === "not"){
			var assert = theController.myModel.find(e.parentElement.id)
			assert.notSelected()
		}
		else{
			var assert = theController.myModel.find(e.parentElement.id)
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
}

//update model when inputs are changed
window.addEventListener('input', function (e) {
	var identifier = e.target.id.substr(e.target.id.length -2)
	if (e.target.id.substr(0, 4) === "Item"){
		console.log(1)
		if (identifier === "t1" ){
			console.log(2)
			let id = e.target.id.slice(0, -2)
			console.log(id)
			var item = theController.myModel.find(id)
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
			var item = theController.myModel.find(id)
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

 // <textarea onkeyup="getLineNumber(this, document.getElementById('lineNo'));" onmouseup="this.onkeyup();"></textarea>
 // <div id="lineNo"></div>
 // <script>
 //     function getLineNumber(textarea, indicator) {
 //         indicator.innerHTML = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
 //     }
 // </script>

 window.onkeypress = function(e) {
     if (e.key == 'ArrowDown') {
		if(e.target.type === "textarea"){
			if(e.target.value.substr(0, e.target.selectionEnd).split("\n").length === e.target.value.split("\n").length){
				let newIndex = theController.myView.inputs.findIndex(x => x.id == e.target.id)+1
				if (newIndex < theController.myView.inputs.length) theController.myView.inputs[newIndex].focus()
				e.preventDefault()
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
				let newIndex = theController.myView.inputs.findIndex(x => x.id == e.target.id)+1
				if (newIndex < theController.myView.inputs.length) theController.myView.inputs[newIndex].focus()
				e.preventDefault()
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
 	ctxMenu.style.display = ""
 	ctxMenu.style.left = ""
 	ctxMenu.style.top = ""
 }
