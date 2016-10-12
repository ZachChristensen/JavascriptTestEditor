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
				var currentItem = TC.myModel.find(SELECTEDSUITE)
				TC.myModel.setCurrentSuite(currentItem)
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
				var currentItem = TC.myModel.find(SELECTEDSUITE)
				TC.myModel.setCurrentSuite(currentItem)
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
					var item = TC.myModel.find(itemID)
					if (item.type === "AfterEach"){
						item.parent.myAfter = undefined
						TC.updateDisplay()
						return
					}
					if (item.type === "BeforeEach"){
						item.parent.myBefore = undefined
						TC.updateDisplay()
						return
					}
					//If deleting root suite
					if (item.parent === "None"){
						TC.myModel.root = undefined
						TC.myModel.currentSuite = undefined
						idGenerator = new idCounter();
					}
					else{
						TC.myModel.currentSuite = item.parent
						let theParent = item.parent
						let index = theParent.allMyChildren.findIndex(x => x.id == item.id)
						theParent.removeChild(index)
					}
					TC.updateDisplay()
				}
			}
		}

		let clonebtns = document.getElementsByClassName("btnClone")
		for (var btn of clonebtns){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = TC.myModel.find(SELECTEDSUITE)
				let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
				currentItem.parent.cloneChild(index)

			}
		}

		let copybtns = document.getElementsByClassName("btnCopy")
		for (var btn of copybtns){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				console.log(event.target.parentElement.parentElement.parentElement.id)
				var currentItem = TC.myModel.find(SELECTEDSUITE)
				TC.myModel.setCopiedItem(currentItem)
			}
		}

		let cutbtns = document.getElementsByClassName("btnCut")
		for (var btn of cutbtns){
			btn.onclick = function(event) {
				let SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				let currentItem = TC.myModel.find(SELECTEDSUITE)
				let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
				var parent = currentItem.parent
				TC.myModel.setCopiedItem(currentItem)
				parent.removeChild(index)
				TC.updateDisplay()
			}
		}

		let pastebtns = document.getElementsByClassName("btnPaste")
		for (var btn of pastebtns){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = TC.myModel.find(SELECTEDSUITE)
				if ( currentItem.type == "Assert" && currentItem.parent.type == "Spec"){
					currentItem.addPastedItem( TC.myModel.unsetCopiedItem() )
					return
				}
				if ( (currentItem.type == "Spec" || currentItem.type == "Spec") && currentItem.parent.type == "Suite"){
					currentItem.addPastedItem( TC.myModel.unsetCopiedItem() )
					return
				}
			}
		}

		let assertbtns = document.getElementsByClassName("btnAddAssert")
		for (var spec of assertbtns){
			spec.onclick = function(event) {
				console.log("assert func")
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = TC.myModel.find(SELECTEDSUITE)
				TC.myModel.setCurrentTestItem(currentItem)
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
				var currentItem = TC.myModel.find(SELECTEDSUITE)
				TC.myModel.setCurrentTestItem(currentItem)
				TC.myModel.addMiscCode("")
				TC.updateDisplay()
				//focus on new misc
				document.getElementById("modalDescription").focus()
			}
		}
		
		let beforeBtn = document.getElementsByClassName("btnAddBeforeEach")
		for (var btn of beforeBtn){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = TC.myModel.find(SELECTEDSUITE)
				TC.myModel.setCurrentSuite(currentItem)
				TC.myModel.addBeforeEach()
				TC.updateDisplay()				
			}
		}
		
		let afterBtn = document.getElementsByClassName("btnAddAfterEach")
		for (var btn of afterBtn){
			btn.onclick = function(event) {
				var SELECTEDSUITE = event.target.parentElement.parentElement.parentElement.id
				var currentItem = TC.myModel.find(SELECTEDSUITE)
				TC.myModel.setCurrentSuite(currentItem)
				TC.myModel.addAfterEach()
				TC.updateDisplay()				
			}
		}
	}

	outputToDiv(divID, textContent){
		this.myView.appendToDiv(divID, textContent)
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
		console.log(TC.myModel.find(id))
		TC.myModel.updateItem(id, e.target.value)
	}
 }, false);
