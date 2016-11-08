/*
jshint esversion:6, jshint asi:true
*/
//Controller

class Controller{
	constructor(testing = false){
		this.myModel = new Model(this)
		if (!testing){
			this.myView = new HTMLView(this)
		}
		console.log("controller")
	}

	updateDisplay(){
		this.myModel.toHTML()

		let filename = document.getElementById("filename")
		filename.innerHTML = this.myModel.filename

		theController.myModel.selected = []
		this.setButtonOnlicks()
		this.disableDragOnButtons()
	}

	disableDragOnButtons(){
		for (let button of document.getElementsByTagName('Button')){
			button.setAttribute('draggable', false)
			button.setAttribute('onmousedown', 'theController.myView.changeDrag(false, true)')
			button.setAttribute('onmouseup', 'theController.myView.changeDrag(true, false)')
			button.setAttribute('onmouseleave','theController.myView.changeDrag(true)')
		}
		for (let button of document.getElementsByTagName('a')){
			button.setAttribute('draggable', false)
			button.setAttribute('onmousedown', 'theController.myView.changeDrag(false, true)')
			button.setAttribute('onmouseup', 'theController.myView.changeDrag(true, false)')
			button.setAttribute('onmouseleave','theController.myView.changeDrag(true)')
		}
	}

	setButtonOnlicks(){
		//set onclick methods for dropdown addSpec/Suite btns
		let specbtns = document.getElementsByClassName("btnAddSpec")
		for (var spec of specbtns){
			spec.onclick = function(event) {
				var currentItem = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				theController.myModel.setCurrentSuite(currentItem)
				modal_content.setAddSpec()
				theController.myView.modal.style.display = "block"
				document.getElementById("modalDescription").focus()

			}
		}

		let suitebtns = document.getElementsByClassName("btnAddSuite")
		for (var suite of suitebtns){
			suite.onclick = function(event) {
				var currentItem = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				theController.myModel.setCurrentSuite(currentItem)
				modal_content.setAddSuite()
				theController.myView.modal.style.display = "block"
				document.getElementById("modalDescription").focus()
			}
		}

		let deletebtns = document.getElementsByClassName("btnDelete")
		for (var btn of deletebtns){
			btn.onclick = function(event) {
				if (confirm('Are you sure you want to delete this item and all of its subitems?')) {
					var item = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
					//If deleting root suite
					if (item.parent === "None"){
						theController.myModel.root = undefined
						theController.myModel.currentSuite = undefined
						theController.myModel.asserts = []
						idGenerator = new idCounter()
					}
					else{
						theController.myModel.currentSuite = item.parent
						let theParent = item.parent
						let index = theParent.allMyChildren.findIndex(x => x.id == item.id)
						theParent.removeChild(index)
					}
					if (item.type === "Assert"){
						let doesExist = theController.myModel.asserts.findIndex(x => x.id == item.id)
						if (doesExist != -1){
							theController.myModel.asserts.splice(doesExist, 1)
						}
					}
					if (item.hasOwnProperty('allMyChildren')) item.findAssertForRemoval()
					theController.updateDisplay()
					toast_msg.showDeleted()
				}
			}
		}

		let clonebtns = document.getElementsByClassName("btnClone")
		for (var btn of clonebtns){
			btn.onclick = function(event) {
				var currentItem = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
				currentItem.parent.cloneChild(index, true)
				toast_msg.showClone()
			}
		}

		let copybtns = document.getElementsByClassName("btnCopy")
		for (var btn of copybtns){
			btn.onclick = function(event) {
				theController.myModel.setCopiedItem(theController.myModel.find(event.target.parentElement.parentElement.parentElement.id))
				toast_msg.showCopy()
			}
		}

		let cutbtns = document.getElementsByClassName("btnCut")
		for (var btn of cutbtns){
			btn.onclick = function(event) {
				let currentItem = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
				var parent = currentItem.parent
				theController.myModel.setCopiedItem(currentItem)
				parent.removeChild(index)

				currentItem.findAssertForRemoval()

				theController.updateDisplay()
				toast_msg.showCut()
			}
		}

		let pastebtns = document.getElementsByClassName("btnPaste")
		for (var btn of pastebtns){
			btn.onclick = function(event) {
				var currentItem = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				//Check if paste legal
				if (currentItem.hasOwnProperty('allMyChildren')){
					if (theController.myModel.copiedItems.length === 0){
						toast_msg.show("No item copied")
						return
					}
					var pastedItems = theController.myModel.getCopiedItems()
					for (var item of pastedItems){
						if ( (item.type == "Suite" && currentItem.type == "Spec")){
							toast_msg.show("Error Spec cannot contain Suites")
							return
						}
						if ( (item.type == "Spec" && currentItem.type == "Spec")){
							toast_msg.show("Error Spec cannot contain spec")
							return
						}
						if ( (item.type == "BeforeEach" && currentItem.type == "Spec")){
							toast_msg.show("Error Spec cannot contain AfterEach")
							return
						}
						if ( (item.type == "AfterEach" && currentItem.type == "Spec")){
							toast_msg.show("Error Spec cannot contain BeforeEach")
							return
						}
						if ( (item.type == "Assert" && currentItem.type == "Suite")){
							toast_msg.show("Error Suite cannot contain Assert")
							return
						}
					}
					for (var item of pastedItems){
						currentItem.addPastedItem( item )
					}
					toast_msg.showPaste()
				}
			}
		}

		let assertbtns = document.getElementsByClassName("btnAddAssert")
		for (var spec of assertbtns){
			spec.onclick = function(event) {
				console.log("assert func")
				theController.myModel.setCurrentTestItem(theController.myModel.find(event.target.parentElement.parentElement.parentElement.id))
				modal_content.setAddAssert()
				theController.myView.modal.style.display = "block"
				document.getElementById("modalDescription").focus()
			}
		}

		let miscbtns = document.getElementsByClassName("btnAddMisc")
		for (var misc of miscbtns){
			misc.onclick = function(event) {
				theController.myModel.setCurrentTestItem(theController.myModel.find(event.target.parentElement.parentElement.parentElement.id))
				var newMisc = theController.myModel.addMiscCode("")
				theController.updateDisplay()
				//focus on new misc
				var titleElement = document.getElementById(newMisc.id + 't').focus()
			}
		}

		let beforeBtn = document.getElementsByClassName("btnAddBeforeEach")
		for (var btn of beforeBtn){
			btn.onclick = function(event) {
				theController.myModel.setCurrentSuite(theController.myModel.find(event.target.parentElement.parentElement.parentElement.id))
				theController.myModel.addBeforeEach()
				theController.myModel.addMiscCode("")
				theController.updateDisplay()
			}
		}

		let afterBtn = document.getElementsByClassName("btnAddAfterEach")
		for (var btn of afterBtn){
			btn.onclick = function(event) {
				theController.myModel.setCurrentSuite(theController.myModel.find(event.target.parentElement.parentElement.parentElement.id))
				theController.myModel.addAfterEach()
				theController.myModel.addMiscCode("")
				theController.updateDisplay()
			}
		}

		theController.myView.inputs = Array.prototype.slice.call(document.getElementsByClassName("input"))

		for (var assert of this.myModel.asserts){
			console.log(this.myModel.asserts)
			assert.setCurrentDropdown()
		}
	}

	outputToDiv(divID, textContent){
		this.myView.appendToDiv(divID, textContent)
		document.getElementById(divID).addEventListener('dragstart', function(event) {
			event.stopPropagation()
		})
	}

	updateTestItem(targetID, newChildID, newPosition = undefined){
		this.myModel.moveItem(targetID, newChildID, newPosition)
		this.updateDisplay()
	}

	loadTestData(){
		this.myModel.createNewRoot("VERY interesting test suite")
		this.myModel.addSpec("Cook is wearing apron")
		this.myModel.addAssert("cook.apron", false, 'toBeDefined', '')
		var suite = this.myModel.addSuite("Making Pancakes!")
		this.myModel.addBeforeEach()
		this.myModel.addMiscCode("var ingredients = [flour, eggs, milk, butter, banana]")
		this.myModel.addAfterEach()
		this.myModel.addMiscCode("plate.clean()")
		this.myModel.addSpec("Pancakes should be delish")
		this.myModel.addMiscCode("var bananana = 4\nbanana.slice()")
		this.myModel.addAssert("pancakes.eat()", false, 'toEqual', '"deeelish"')

	}

	saveToFile(fileName){
		this.myModel.myFiler.saveToFile(this.myModel, fileName)
	}

	loadFromFile(){
		let that = this
		this.myModel.myFiler.loadSuiteFromFile("fileSelector", this.myModel, function(splitFileArray) {
			that.myModel.myFiler.createTestItems(splitFileArray, that.myModel)
			that.updateDisplay()
			document.getElementById('newRootBtn').style.display = "none"
		})
	}
}
