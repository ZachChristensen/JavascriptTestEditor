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

		//Library of key words used during output(screen & file)
		this.currentLanguage = new jasmineLanguage()
		
		this.selected = []
		this.selectedParent = undefined
	}
	
	selectItem(item){
		//if exist remove them
		if (this.selected.indexOf(item) > -1){
			this.myController.myView.resetItemBackground(item.id)
			let index = this.selected.indexOf(item);
			this.selected.splice(index, 1);
			console.log("already selected")
			return
		}
		if (this.selectedParent === undefined){
			this.selected.push(item)
			this.selectedParent = item.parent
			this.myController.myView.changeItemBackground(item.id)
		}
		else if (this.selectedParent === item.parent ){
			this.selected.push(item)
			theController.myView.changeItemBackground(item.id)
		}
		else{
			for (var i of this.selected){
				this.myController.myView.resetItemBackground(i.id)
			}
			//foreach selected change display back to unselected
			this.selected = []
			this.selectedParent = item.parent
			this.selected.push(item)
			theController.myView.changeItemBackground(item.id)
		}
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
		this.currentTestItem = aSuite
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
		this.currentTestItem = parentSuite.addBefore()
	}

	addAfterEach(){
		//set current suite before calling
		var parentSuite = this.getCurrentSuite()
		this.currentTestItem = parentSuite.addAfter()
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
