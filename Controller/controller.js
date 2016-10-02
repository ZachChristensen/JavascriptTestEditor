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
	}

	outputToDiv(divID, textContent){
		this.myView.appendToDiv(divID, textContent)
	}

	loadTestData(){
		this.myModel.createNewRoot("Root Sweetie")
		this.myModel.addSpec("first Child spec")
		var suite = this.myModel.addSuite("firstChild Suite")
		this.myModel.setCurrentSuite(suite)
		this.myModel.addSpec("child of  child spec 1")
		this.myModel.addSpec("child of  child spec 2")
		this.myModel.addSuite("childOfChild Suite")
		this.myModel.setCurrentSuite(suite)
		this.myModel.addSpec("child of  child spec 3")
	}

	loadFromFile(){
		let that = this
		this.myModel.myFiler.loadSuiteFromFile("fileSelector", this.testFrameWork, function(e) {
			that.updateDisplay();
		})
  	}

	saveViewToModel(){
    	this.myModel.myFiler.createSuite(this.myModel.myFiler.splitString(this.myView.getDisplayedSuite(document.getElementById("1")), "{"));
  	}
}

window.addEventListener('input', function (e) {
	if (e.target.id.substr(0, 4) === "Item"){
		let id = e.target.id.slice(0, -1)
		TC.myModel.updateItem(id, e.target.value)
	}
 }, false);
