//Controller

class Controller{
	constructor(){
		this.myModel = new Model(this)
		this.myView = new HTMLView(this)
		console.log("controller")
	}

	updateDisplay(){
		this.myModel.toHTML()

		let filename = document.getElementById("filename")
		filename.innerHTML = this.myModel.filename

		theController.myModel.selected = []
		this.setButtonOnlicks()
	}

	setButtonOnlicks(){
		//set onclick methods for dropdown addSpec/Suite btns
		let specbtns = document.getElementsByClassName("btnAddSpec")
		for (var spec of specbtns){
			spec.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = theController.myModel.find(SELECTEDSUITE)
				theController.myModel.setCurrentSuite(currentItem)
				modal_content.setAddSpec()
				modal.style.display = "block"
				NEWTYPE = "SPEC"
				document.getElementById("modalDescription").focus()

			}
		}

		let suitebtns = document.getElementsByClassName("btnAddSuite")
		for (var suite of suitebtns){
			suite.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = theController.myModel.find(SELECTEDSUITE)
				theController.myModel.setCurrentSuite(currentItem)
				modal_content.setAddSuite()
				modal.style.display = "block"
				NEWTYPE = "SUITE"
				document.getElementById("modalDescription").focus()
			}
		}

		let deletebtns = document.getElementsByClassName("btnDelete")
		for (var btn of deletebtns){
			btn.onclick = function(event) {
				if (confirm('Are you sure you want to delete this item and all of its subitems?')) {
					var itemID = event.target.parentElement.parentElement.parentElement.id
					var item = theController.myModel.find(itemID)
					//If deleting root suite
					if (item.parent === "None"){
						theController.myModel.root = undefined
						theController.myModel.currentSuite = undefined
						theController.myModel.asserts = []
						idGenerator = new idCounter();
					}
					else{
						theController.myModel.currentSuite = item.parent
						let theParent = item.parent
						let index = theParent.allMyChildren.findIndex(x => x.id == item.id)
						theParent.removeChild(index)
					}

					let doesExist = theController.myModel.asserts.findIndex(x => x.id == item.id)
					if (doesExist != -1){
						console.log(theController.myModel.asserts)
						theController.myModel.asserts.splice(doesExist, 1)
						console.log(theController.myModel.asserts)
					}

					theController.updateDisplay()
					toast_msg.showDeleted()
				}
			}
		}

		let clonebtns = document.getElementsByClassName("btnClone")
		for (var btn of clonebtns){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = theController.myModel.find(SELECTEDSUITE)
				let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
				currentItem.parent.cloneChild(index, true)
				toast_msg.showClone()
			}
		}

		let copybtns = document.getElementsByClassName("btnCopy")
		for (var btn of copybtns){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = theController.myModel.find(SELECTEDSUITE)
				theController.myModel.setCopiedItem(currentItem)
				toast_msg.showCopy()
			}
		}

		let cutbtns = document.getElementsByClassName("btnCut")
		for (var btn of cutbtns){
			btn.onclick = function(event) {
				let SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				let currentItem = theController.myModel.find(SELECTEDSUITE)
				let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
				var parent = currentItem.parent
				theController.myModel.setCopiedItem(currentItem)
				parent.removeChild(index)
				theController.updateDisplay()
				toast_msg.showCut()
			}
		}

		let pastebtns = document.getElementsByClassName("btnPaste")
		for (var btn of pastebtns){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = theController.myModel.find(SELECTEDSUITE)
				//Check if paste legal
				if (currentItem.hasOwnProperty('allMyChildren')){
					var pastedItems = theController.myModel.getCopiedItems()
					if (pastedItems == []){
						toast_msg.show("No item copied")
						return
					}
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
					}
					for (var item of pastedItems){
						currentItem.addPastedItem( item )
					}

				}
				toast_msg.showPaste()
			}
		}

		let assertbtns = document.getElementsByClassName("btnAddAssert")
		for (var spec of assertbtns){
			spec.onclick = function(event) {
				console.log("assert func")
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = theController.myModel.find(SELECTEDSUITE)
				theController.myModel.setCurrentTestItem(currentItem)
				modal_content.setAddAssert()
				modal.style.display = "block"
				NEWTYPE = "Assert"
				document.getElementById("modalDescription").focus()
			}
		}

		let miscbtns = document.getElementsByClassName("btnAddMisc")
		for (var misc of miscbtns){
			misc.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = theController.myModel.find(SELECTEDSUITE)
				theController.myModel.setCurrentTestItem(currentItem)
				var newMisc = theController.myModel.addMiscCode("")
				theController.updateDisplay()
				//focus on new misc
				var titleElement = document.getElementById(newMisc.id + 't').focus()
			}
		}

		let beforeBtn = document.getElementsByClassName("btnAddBeforeEach")
		for (var btn of beforeBtn){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = theController.myModel.find(SELECTEDSUITE)
				theController.myModel.setCurrentSuite(currentItem)
				theController.myModel.addBeforeEach()
				theController.myModel.addMiscCode("")
				theController.updateDisplay()
			}
		}

		let afterBtn = document.getElementsByClassName("btnAddAfterEach")
		for (var btn of afterBtn){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = theController.myModel.find(SELECTEDSUITE)
				theController.myModel.setCurrentSuite(currentItem)
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
			event.stopPropagation();
		});
	}

	updateTestItem(targetID, newChildID){
		this.myModel.moveItem(targetID, newChildID)
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
