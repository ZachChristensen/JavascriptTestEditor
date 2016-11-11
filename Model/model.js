/*
jshint esversion:6, jshint asi:true
*/
//MODEL

class Model{
	constructor(newController){
		console.log("model")
		this.myController = newController
		this.myFiler = new Filer(this)

		this.root = undefined
		this._copiedItems = []

		this._currentSuite = this.root

		this.filename = 'newFile.js'

		this._currentTestItem = undefined

		this.currentLanguage = new jasmineLanguage()
		this.asserts = []
		this.selected = []
		this.selectedParent = undefined
	}

	    set currentSuite  (suite)  { this._currentSuite = suite             }
		get currentSuite  ()  { return this._currentSuite  				   }
		set currentTestItem  (testItem)  { this._currentTestItem = testItem }
		get currentTestItem  ()  { return this._currentTestItem  	       }
		set copiedItem (item) { this._copiedItems = [item]				   }
		set copiedItems (items) { this._copiedItems = items				   }
		get copiedItems () { return this._copiedItems					   }

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
			for (let i of this.selected){
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
		if(newChild != newParent && newParent !== undefined && this.checkChildToParentCompatability(newChild, newParent)){
			let oldParent = newChild.parent
			for (let i = 0; i < oldParent.allMyChildren.length; i++){
				if (newChildID == oldParent.allMyChildren[i].id){
					childLocationInOldParent = i
					console.log("found child location in old parent: " + childLocationInOldParent)
				}
			}
			console.log(newPosition + " " + (newParent != oldParent) + " " + (childLocationInOldParent == newPosition - 1) + " :cliop")
			console.log("c")
			newChild.parent = newParent
			console.log("set newparent")
			oldParent.allMyChildren.splice(childLocationInOldParent, 1)
			console.log(newPosition)
			if (newPosition != undefined) {
				console.log(newPosition)
				newParent.allMyChildren.splice(newPosition, 0, newChild)
				console.log("added new child to new parent")
			}else{
				newParent.allMyChildren.push(newChild)
			}
			return true
		}
		return false
	}

	checkChildToParentCompatability(child, parent){
		if (parent != undefined && child != undefined){
			if (parent.type == "Suite"){
				if (child.type == "Assert") {
					toast_msg.show("Suite cannot contain " + child.type+"s")
					return false
				}
				return true
			}else if (parent.type == "Spec") {
				if (child.type == "Misc" || child.type == "Assert"){
					return true
				}
				toast_msg.show("Spec cannot contain " + child.type)
				return false
			}else if (parent.type == "BeforeEach" || parent.type == "AfterEach") {
				if (child.type == "Misc"){
					return true
				}
				toast_msg.show(parent.type +" cannot contain " + child.type+"s")
				return false
			}else{
				return false
			}
		}
	}

	createNewRoot(descriptionStr){
		this.root = new Suite(descriptionStr)
		this.currentSuite = this.root
		this.currentTestItem = this.root
	}

	addCopiedItem (item) {
		this.copiedItems.push(item)
	}

	addSuite (descriptionStr, disabled) {
		let aSuite, parent
		parent = this.currentSuite
		aSuite = new Suite(descriptionStr, parent, disabled)
		parent.allMyChildren.push(aSuite)
		this.currentSuite = aSuite
		this.currentTestItem = aSuite
		return aSuite
	}

	addSpec (descriptionStr) {
		let parentSuite = this.currentSuite
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

	addBeforeEachToEnd(){
		//set current suite before calling
		let parentSuite = this.currentSuite
		this.currentTestItem = parentSuite.addBeforeToEnd()
	}

	addBeforeEach(){
		//set current suite before calling
		let parentSuite = this.currentSuite
		this.currentTestItem = parentSuite.addBefore()
	}

	addAfterEachToEnd(){
		//set current suite before calling
		let parentSuite = this.currentSuite
		this.currentTestItem = parentSuite.addAfterToEnd()
	}

	addAfterEach(){
		//set current suite before calling
		let parentSuite = this.currentSuite
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
		let item = this.find(elementID)
		if (item !== undefined){
			if (item.type === "Assert"){
				item.contents = newStr
			}
			else if(item.type === "Misc"){
				item.contents = newStr
			}
			else item.description = newStr
			console.log(item)
		}
	}

	toString() {
		return this.root.toString(0)
	}

	toHTML() {
		let HTMLdiv = document.getElementById('main')
		HTMLdiv.innerHTML = ""
		if (this.root !== undefined){

			return this.root.toHTML('main')
		}else{
			document.getElementById('newRootBtn').style.display = "block"
		}
	}

}
