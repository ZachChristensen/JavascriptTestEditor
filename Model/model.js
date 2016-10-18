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
	}

	moveItem(targetID, newChildID){
		let newParent = undefined
		let childLocationInOldParent = 0
		let newChild = this.root.findChild(newChildID)
		if(this.root.id == targetID){
			newParent = this.root
		}else{
			newParent = this.root.findChild(targetID)
		}
		if(this.checkChildToParentCompatability(newChild, newParent) && newChild.parent != newParent){
			let oldParent = newChild.parent
			for (let i = 0; i < oldParent.allMyChildren.length; i++){
				if (newChildID == oldParent.allMyChildren[i].id){
					childLocationInOldParent = i
				}
			}
			newChild.parent = newParent
			if(newChild.type == "BeforeEach" || newChild.type == "AfterEach"){
				newParent.allMyChildren.splice(0, 0, newChild);
			}else{
				newParent.allMyChildren.push(newChild)
			}
			oldParent.allMyChildren.splice(childLocationInOldParent, 1)
			return true
		}
		return false
	}

	checkChildToParentCompatability(child, parent){
		if (parent.type == "Suite"){
			return true
		}else if (parent.type == "Spec") {
			if (child.type == "Misc" || child.type == "Assert"){
				return true
			}
			return false
		}else if (parent.type == "BeforeEach" || parent.type == "AfterEach") {
			if (child.type == "Misc" || child.type == "Assert"){
				return true
			}
			return false
		}else{
			return false
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
