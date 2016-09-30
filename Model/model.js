//MODEL

class Model{
	constructor(newController){
		console.log("model")
		this.myController = newController
		this.myFiler = new Filer()
		
		//danger code!
		this.root = undefined
		
		this.currentSuite = this.root
		//Attempt loading, if nothing then create new?
	}
	
	createNewRoot(descriptionStr){
		this.root = new Suite(descriptionStr)
		this.currentSuite = this.root
	}
	
	setCurrentSuite (suite) {
		this.currentSuite = suite
	}

	getCurrentSuite () {
		return this.currentSuite
	}

	addSuite (descriptionStr) {
		var aSuite, parent
		parent = this.getCurrentSuite()
		aSuite = new Suite(descriptionStr, parent)
		parent.allMyChildren.push(aSuite)
		this.setCurrentSuite(aSuite)
		return aSuite
	}

	addSpec (descriptionStr) {
		var parentSuite = this.getCurrentSuite()
		parentSuite.addSpec(descriptionStr, parentSuite)
	}

	find (idStr) {
		if (this.root.id === idStr){
			return this.root
		}
		return this.root.findChild(idStr)
	}
	
	updateItem(elementID, newStr){
		this.find(elementID).description = newStr
		console.log(this.find(elementID))
	}

	toString() {
		return this.root.toString(0)
	}

	toHTML() {
		var HTMLdiv = document.getElementById('main')
		HTMLdiv.innerHTML = ""
		if (this.root !== undefined){
			return this.root.toHTML('main')
		}else{
			HTMLdiv.innerHTML = "<button id='newRootBtn' onclick='alert(\"Just kidding it does not work yet\")'>+ Add New Suite</button>"
		}
	}

}