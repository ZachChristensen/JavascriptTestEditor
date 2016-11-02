//MODEL

class Model{
	constructor(newController){
		console.log("model")
		this.myController = newController
		this.myFiler = new Filer(this)

		//danger code!
		this.root = undefined
		this.copiedItems = []

		this.currentSuite = this.root
		//Attempt loading, if nothing then create new?

		this.filename = 'newFile.js'

		this.currentTestItem = undefined

		//Library of key words used during output(screen & file)
		this.currentLanguage = new jasmineLanguage()
		this.asserts = []
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

	moveItem(targetID, newChildID, newPosition = undefined){
		console.log(targetID + ' ' + newChildID)
		let newParent = undefined
		let childLocationInOldParent = 0
		let newChild = this.root.findChild(newChildID)
		if(this.root.id == targetID){
			newParent = this.root
			console.log("found parent: " + newParent.id)
		}else{
			newParent = this.root.findChild(targetID)
			console.log("found parent: " + newParent.id)
		}
		if(this.checkChildToParentCompatability(newChild, newParent) && newChild.parent != newParent && newChild != newParent && newParent !== undefined){
			console.log("compatible child and parent. new child:" + newChild.id + " newparent:" + newParent.id)
			let oldParent = newChild.parent
			console.log("set newchilds old parent to: " + oldParent.id)
			for (let i = 0; i < oldParent.allMyChildren.length; i++){
				if (newChildID == oldParent.allMyChildren[i].id){
					childLocationInOldParent = i
					console.log("found child location in old parent: " + childLocationInOldParent)
				}
			}
			newChild.parent = newParent
			console.log("set newparent")
			if(newChild.type == "BeforeEach" || newChild.type == "AfterEach"){
				newParent.allMyChildren.splice(0, 0, newChild)
				console.log("adding before or after")
			}else{
				console.log(newPosition)
				if (newPosition != undefined) {
					newParent.allMyChildren.splice(newPosition, 0, newChild)
					console.log("added new child to new parent")
				}else{
					newParent.allMyChildren.push(newChild)
				}
			}
			console.log("removed child:" + oldParent.allMyChildren[childLocationInOldParent].id + " from old parent ")
			oldParent.allMyChildren.splice(childLocationInOldParent, 1)

			return true
		}
		return false
	}

	checkChildToParentCompatability(child, parent){
		if (parent != undefined && child != undefined){
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

	setCopiedItem (item) {
		this.copiedItems = [item]
	}

	addCopiedItem (item) {
		this.copiedItems.push(item)
	}

	setCopiedItems (items) {
		this.copiedItems = items
	}

	getCopiedItems (suite) {
		if (this.copiedItems.length === 0){
			return
		}
		var item = this.copiedItems
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

	addAssert (contents="", not=false, matcher="", contents2="") {
		if(this.currentTestItem != undefined){
			this.asserts.push(this.currentTestItem.addAssert(contents, not, matcher, contents2))
		}
	}

	addMiscCode (miscCode) {
		if(this.currentTestItem != undefined){
			return this.currentTestItem.addMiscCode(miscCode, this.currentTestItem)
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
		console.log('update item')
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
