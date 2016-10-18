//Controller

class Controller{
	constructor(){
		this.myModel = new Model(this)
		this.myView = new HTMLView(this)
		console.log("controller")
	}

	updateDisplay(){
		this.myModel.toHTML()

		//set onclick methods for dropdown addSpec/Suite btns
		let specbtns = document.getElementsByClassName("btnAddSpec")
		for (var spec of specbtns){
			spec.onclick = function(event) {
				console.log("spec func")
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
				console.log("suite func")
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
				console.log("delete func")
				if (confirm('Are you sure you want to delete this item and all of its subitems?')) {
					var itemID = event.target.parentElement.parentElement.parentElement.id
					var item = theController.myModel.find(itemID)
					//If deleting root suite
					if (item.parent === "None"){
						theController.myModel.root = undefined
						theController.myModel.currentSuite = undefined
						idGenerator = new idCounter();
					}
					else{
						theController.myModel.currentSuite = item.parent
						let theParent = item.parent
						let index = theParent.allMyChildren.findIndex(x => x.id == item.id)
						theParent.removeChild(index)
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
				currentItem.parent.cloneChild(index)
				toast_msg.showClone()
			}
		}

		let copybtns = document.getElementsByClassName("btnCopy")
		for (var btn of copybtns){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				console.log(event.target.parentElement.parentElement.parentElement.id)
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
					var pastedItem = theController.myModel.unsetCopiedItem()

					if ( (pastedItem.type == "Suite" && currentItem.type == "Spec")){
						toast_msg.show("Error Spec cannot contain Suites")
						return
					}
					currentItem.addPastedItem( pastedItem )
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
				theController.myModel.addMiscCode("")
				theController.updateDisplay()
				//focus on new misc
				document.getElementById("modalDescription").focus()
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
	}

	outputToDiv(divID, textContent){
		this.myView.appendToDiv(divID, textContent)
		document.getElementById(divID).addEventListener('dragstart', function(event) {
   		event.stopPropagation();
		});
	}

	loadTestData2(){
		this.myModel.createNewRoot("Root Sweetie")
		this.myModel.addSpec("first Child spec")
		var suite = this.myModel.addSuite("firstChild Suite")
		this.myModel.setCurrentSuite(suite)
		this.myModel.addSpec("child of  child spec 1")
		this.myModel.addSpec("child of  child spec 2")
		this.myModel.addSuite("childOfChild Suite")
		this.myModel.addSpec("child of  child spec 3")
	}

	loadTestData(){
		this.myModel.createNewRoot("Root Sweetie")
		this.myModel.addSpec("first Child spec")
		this.myModel.addAssert("Assert == Hello")
		var suite = this.myModel.addSuite("firstChild Suite")
		this.myModel.addBeforeEach()
		this.myModel.addMiscCode("var apple = 600")
		this.myModel.addAfterEach()
		this.myModel.addMiscCode("var apple = 0")
		this.myModel.addSpec("child of  child spec 1")
		this.myModel.addMiscCode("var bananana = 4")
		this.myModel.addAssert("Assert 2")
		this.myModel.addSpec("child of  child spec 2")
	}

	saveToFile(fileName){
		this.myModel.myFiler.saveToFile(this.myModel, fileName)
	}

	loadFromFile(){
		let that = this
		this.myModel.myFiler.loadSuiteFromFile("fileSelector", this.myModel, function(splitFileArray) {
			that.myModel.myFiler.createTestItems(splitFileArray, that.myModel)
			that.updateDisplay()
		})
	}
}

window.addEventListener('input', function (e) {
	if (e.target.id.substr(0, 4) === "Item"){
		let id = e.target.id.slice(0, -1)
		console.log(theController.myModel.find(id))
		theController.myModel.updateItem(id, e.target.value)
	}
 }, false);
