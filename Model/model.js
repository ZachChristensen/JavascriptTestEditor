/*
jshint esversion:6, asi:true
*/
/**
* Model
*
* @class Model
* @constructor
*/
class Model{
	/**
	* Class Constructor
	*
	* @method Constructor
	* @param {Controller} newController
	*/
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

	/**
	* Sets an items html to selected and sets selecteditem
	*
	* @method selectItem
	* @param {TestItem} item
	*/
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

	/**
	* Moves an item from one place in the model to another
	*
	* @method moveItem
	* @param {int} targetID
	* @param {int} newChildID
	* @param {int} newPosition
	*/
	moveItem(targetID, newChildID, newPosition = undefined){
		let newParent
		let childLocationInOldParent = 0
		let newChild = this.root.findChild(newChildID)
		if(this.root.id == targetID){
			newParent = this.root
		}else{
			newParent = this.root.findChild(targetID)
		}
		if(newChild != newParent && newParent !== undefined && this.checkChildToParentCompatability(newChild, newParent)){
			let oldParent = newChild.parent
			for (let i = 0; i < oldParent.allMyChildren.length; i++){
				if (newChildID == oldParent.allMyChildren[i].id){
					childLocationInOldParent = i
				}
			}
			newChild.parent = newParent
			oldParent.allMyChildren.splice(childLocationInOldParent, 1)
			if (newPosition !== undefined) {
				newParent.allMyChildren.splice(newPosition, 0, newChild)
			}else{
				newParent.allMyChildren.push(newChild)
			}
			return true
		}
		return false
	}

	/**
	* Checks if a child is compatible with the parent
	*
	* @method checkChildToParentCompatability
	* @param {TestItem} child
	* @param {TestItem} parent
	*/
	checkChildToParentCompatability(child, parent){
		if (parent !== undefined && child !== undefined){
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

	/**
	* Creates a new root suite
	*
	* @method createNewRoot
	* @param {string} descriptionStr
	*/
	createNewRoot(descriptionStr){
		this.root = new Suite(descriptionStr)
		this.currentSuite = this.root
		this.currentTestItem = this.root
	}

	/**
	* Adds an item to the copiedItems array
	*
	* @method addCopiedItem
	* @param {TestItem} item
	*/
	addCopiedItem (item) {
		this.copiedItems.push(item)
	}

	/**
	* Adds a suite to the currentSuite
	*
	* @method addSuite
	* @param {string} descriptionStr
	* @param {boolean} disabled
	*/
	addSuite (descriptionStr, disabled = false) {
		let aSuite, parent
		parent = this.currentSuite
		aSuite = new Suite(descriptionStr, parent, disabled)
		parent.allMyChildren.push(aSuite)
		this.currentSuite = aSuite
		this.currentTestItem = aSuite
		return aSuite
	}

	/**
	* Adds a spec to the currentSuite
	*
	* @method addSpec
	* @param {string} descriptionStr
	*/
	addSpec (descriptionStr) {
		let parentSuite = this.currentSuite
		this.currentTestItem = parentSuite.addSpec(descriptionStr, parentSuite)
		return this.currentTestItem
	}

	/**
	* Adds an assert to the currentTestItem
	*
	* @method addAssert
	* @param {string} content
	* @param {boolean} not
	* @param {string} matcher
	* @param {string} content2
	*/
	addAssert (content="", not=false, matcher="", content2="") {
		if(this.currentTestItem !== undefined){
			let newAssert = this.currentTestItem.addAssert(content, not, matcher, content2)
			this.asserts.push(newAssert)
			return newAssert
		}
	}

	/**
	* Adds a MiscCode to the currentTestItem
	*
	* @method addMiscCode
	* @param {MiscCode} miscCode
	*/
	addMiscCode (miscCode) {
		if(this.currentTestItem !== undefined){
			return this.currentTestItem.addMiscCode(miscCode, this.currentTestItem)
		}
	}

	/**
	* Adds a beforeEach to the end of the currentSuite
	*
	* @method addBeforeEachToEnd
	*/
	addBeforeEachToEnd(){
		//set current suite before calling
		let parentSuite = this.currentSuite
		this.currentTestItem = parentSuite.addBeforeToEnd()
	}

	/**
	* Adds a beforeEach to the start of the currentSuite
	*
	* @method addBeforeEach
	*/
	addBeforeEach(){
		//set current suite before calling
		let parentSuite = this.currentSuite
		this.currentTestItem = parentSuite.addBefore()
	}

	/**
	* Adds an afterEach to the end of the currentSuite
	*
	* @method addAfterEachToEnd
	*/
	addAfterEachToEnd(){
		//set current suite before calling
		let parentSuite = this.currentSuite
		this.currentTestItem = parentSuite.addAfterToEnd()
	}

	/**
	* Adds an afterEach to the start of the currentSuite
	*
	* @method addAfterEach
	*/
	addAfterEach(){
		//set current suite before calling
		let parentSuite = this.currentSuite
		this.currentTestItem = parentSuite.addAfter()
	}

	/**
	* Finds a matching testitem
	*
	* @method find
	* @param {string} idStr
	*/
	find (idStr) {
		if (this.root.id === idStr){
			return this.root
		}
		return this.root.findChild(idStr)
	}

	/**
	* Updates an items content
	*
	* @method updateItem
	* @param {id} elementID
	* @param {string} newStr
	*/
	updateItem(elementID, newStr){
		let item = this.find(elementID)
		if (item !== undefined){
			if (item.type === "Assert"){
				item.content = newStr
			}
			else if(item.type === "Misc"){
				item.content = newStr
			}
			else item.description = newStr
		}
	}

	/**
	* Returns the string output of the root item and all of its children
	*
	* @return {string} resultStr
	*/
	toString() {
		return this.root.toString(0)
	}

	/**
	* Outputs this testitem and all of its children to html
	*
	* @method toHTML
	* @return {string} suiteHTML
	*/
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
