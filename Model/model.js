//MODEL

class Model{
	constructor(newController){
		console.log("model")
		this.myController = newController
		this.myFiler = new Filer()

		//danger code!
		this.root = undefined
		this.copiedItem = undefined

		this.currentSuite = this.root
		//Attempt loading, if nothing then create new?

		this.currentTestItem = undefined
	}

	createNewRoot(descriptionStr){
		this.root = new Suite(descriptionStr)
		this.setCurrentSuite(this.root)
	}

	setCurrentSuite (suite) {
		this.currentSuite = suite
	}

	getCurrentSuite () {
		return this.currentSuite
	}

	setCurrentTestItem (suite) {
		this.currentTestItem = suite
	}

	getCurrentTestItem () {
		return this.currentTestItem
	}

	setCopiedItem (suite) {
		this.copiedItem = suite
	}

	unsetCopiedItem (suite) {
		var item = this.copiedItem
		this.copiedItem = undefined
		return item
	}

	addSuite (descriptionStr, disabled) {
		var aSuite, parent
		parent = this.getCurrentSuite()
		aSuite = new Suite(descriptionStr, parent, disabled)
		parent.allMyChildren.push(aSuite)
		this.setCurrentSuite(aSuite)
		return aSuite
	}

	addSpec (descriptionStr) {
		var parentSuite = this.getCurrentSuite()
		this.currentTestItem = parentSuite.addSpec(descriptionStr, parentSuite)
	}

	addAssert (contents) {
		if(this.currentTestItem != undefined){
			this.currentTestItem.addAssert(contents, this.currentTestItem)
		}
	}

	addMiscCode (miscCode) {
		if(this.currentTestItem != undefined){
			this.currentTestItem.addMiscCode(miscCode, this.currentTestItem)
		}
	}

	addBeforeEach(){
		//set current suite before calling
		var parentSuite = this.getCurrentSuite()

		parentSuite.addBefore()
		this.currentTestItem = parentSuite.myBefore
	}

	addAfterEach(){
		//set current suite before calling
		var parentSuite = this.getCurrentSuite()
		parentSuite.addAfter()
		this.currentTestItem = parentSuite.myAfter
	}

	find (idStr) {
		if (this.root.id === idStr){
			return this.root
		}
		return this.root.findChild(idStr)
	}

	updateItem(elementID, newStr){
		var item = this.find(elementID)
		if (item.type === "Assert"){
			item.contents = newStr
		}
		else if(item.type === "Misc"){
			item.contents = newStr
		}
		else item.description = newStr
		console.log(item)
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
			document.getElementById('newRootBtn').style.display = "block"
		}
	}

}
