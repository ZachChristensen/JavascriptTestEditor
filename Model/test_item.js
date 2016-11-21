/*
jshint esversion:6, asi:true
*/

/**
* A TestItem
*
* @class TestItem
* @constructor
*/
class TestItem {
	/**
	* Class Constructor
	*
	* @method Constructor
	* @param {string} newDesc
	* @param {string} newType
	* @param {TestItem} newParent
	*/
	constructor ( newDesc, newType, newParent = "None") {
		this._description = newDesc
		this.type = newType
		this.id = idGenerator()
		this.parent = newParent
	}

	/**
	* Sets this testitems's description
	*
	* @method description
	* @param {string} description
	*/
	set description ( newDesc ){ this._description = newDesc }

	/**
	* Returns this testitems's description
	*
	* @method description
	* @return {string} description
	*/
	get description () { return this._description }

	/**
	* Outputs this testitem to html
	*
	* @method toHTML
	*/
	toHTML(Parent){
		let backColour = 240-(this.findIndent() * 22)
		var index
		var newText

		if (this.parent !== "None"){
			index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		//Name used to display
		if (this.type === "Suite") name = theController.myModel.currentLanguage.suite
		else if (this.type === "Spec") name = theController.myModel.currentLanguage.spec
		//ToDo if text gets too dark change font color?
		if (backColour < 60) backColour = 60
		if (this === theController.myModel.root) newText = "<div ondrop='theController.myView.drop(event)' ondragend='theController.myView.dragEndCheck()' ondragstart='theController.myView.drag(event)' ondragover='theController.myView.allowDrop(event)' draggable='true' class='"+this.type+" TestItem' style='margin:1em 0 8em 0' id='" + this.id + "'>"
		else newText = "<div ondrop='theController.myView.drop(event)' ondragstart='theController.myView.drag(event)' ondragend='theController.myView.dragEndCheck()' ondragover='theController.myView.allowDrop(event)' draggable='true' class='"+this.type+" TestItem' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'
		newText += '<a class="btnDelete">Delete</a>'

		if (this.type === "Suite"){
			newText += '<a class="btnAddSpec">Add '+theController.myModel.currentLanguage.spec+'</a> <a class="btnAddSuite">Add '+theController.myModel.currentLanguage.suite+'</a>'
			newText += '<a class="btnAddBeforeEach">Add beforeEach</a>'
			newText += '<a class="btnAddAfterEach">Add afterEach</a>'
		}
		if (this.type === "Spec") newText += '<a class="btnAddAssert">Add Assert</a>'
		newText += '<a class="btnAddMisc">Add Code</a>'

		if (this !== theController.myModel.root) newText += '<a class="btnClone">Clone</a>'
		newText += '<a class="btnCopy">Copy</a>'
		if (this !== theController.myModel.root) newText += '<a class="btnCut">Cut</a>'

		if (this.hasOwnProperty("allMyChildren")) newText += '<a class="btnPaste">Paste</a>'
		if (this !== theController.myModel.root){
			//out
			if (this.parent.parent !== "None") newText += "<a href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveOut()' title='Move object out along side it&apos;s containing suite'>Move Out</a>"
			//in
			if (index !== 0 && this.parent.allMyChildren[index-1].type === "Suite") newText += "<a title='Move object into a suite above' href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveIn()' >Move In</a>"
			//up
			if (index !== 0) newText += "<a title='Move object up' href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveUp()'>Move Up</a>"
			//down
			if (index !== (this.parent.allMyChildren.length - 1)) newText += "<a title='Move object down' href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveDown()' >Move Down</a>"
		}
		newText += '</div></div>'
		//for the different text box sizes move to css later
		if (this.type === "Suite"){
			newText += " " + name + "&nbsp;&nbsp;" + "<input class='input' placeholder='Describe this section of your test...' draggable='false' onmousedown='theController.myView.changeDrag(false, true)' onmouseup='theController.myView.changeDrag(true, false)' onmouseleave='theController.myView.changeDrag(true)' style='width: calc(100% - 115px);' id='" + this.id + "t' type='text' value='" + this.description.replace(/\'/g,"&#8217;") + "'></input> </div>"
		}
		else{
			newText += " " + name + "&nbsp;&nbsp;" + "<input class='input' placeholder='Describe this section of your test...' draggable='false' onmousedown='theController.myView.changeDrag(false, true)' onmouseup='theController.myView.changeDrag(true, false)' onmouseleave='theController.myView.changeDrag(true)' style='width: calc(100% - 60px);' id='" + this.id + "t' type='text' value='" + this.description.replace(/\'/g,"&#8217;") + "'></input> </div>"
		}
		theController.outputToDiv(Parent, newText)
		if(this.hasOwnProperty("allMyChildren")){
			for (var baby of this.allMyChildren){
				baby.toHTML(this.id)
			}
		}
		theController.myView.setItemClickListeners(this.id)
	}

	/**
	* Moves this test item in
	*
	* @method moveIn
	*/
	moveIn(){
		//item above it becomes parent
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		//check index not negative
		if (index !== 0 && this.parent.allMyChildren[index-1].type == "Suite"){
			let newParent = this.parent.allMyChildren[index-1]
			let me = this.parent.allMyChildren[index]
			this.parent.allMyChildren.splice(index, 1)
			newParent.allMyChildren.push(me)
			this.parent = newParent
			theController.updateDisplay()
		}
		else{
			console.log("No suite positioned above to attach to")
		}
	}

	/**
	* Moves this test item out
	*
	* @method moveOut
	*/
	moveOut(){
		//moves out and under parent unless parent is root.
		if (this.parent.hasOwnProperty('parent') && this.parent.parent != "None"){
			let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
			let me = this.parent.allMyChildren[index]
			this.parent.allMyChildren.splice(index, 1)
			this.parent = this.parent.parent
			this.parent.allMyChildren.push(me)
			theController.updateDisplay()
		}
		else{
			console.log("Unable to move "+ this.type +" out")
		}
	}

	/**
	* Moves this test item up
	*
	* @method moveUp
	*/
	moveUp(){
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		if (index !== 0){
			var temp = this.parent.allMyChildren[index-1]
			this.parent.allMyChildren[index-1] = this.parent.allMyChildren[index]
			this.parent.allMyChildren[index] = temp
		}
		theController.updateDisplay()
	}

	/**
	* Moves this test item down
	*
	* @method moveDown
	*/
	moveDown(){
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		if (index != this.parent.allMyChildren.length-1){
			var temp = this.parent.allMyChildren[index+1]
			this.parent.allMyChildren[index+1] = this.parent.allMyChildren[index]
			this.parent.allMyChildren[index] = temp
		}
		theController.updateDisplay()
	}

	/**
	* Finds the current indent of this item
	*
	* @method findIndent
	* @return {int} depth
	*/
	findIndent(){
		var current = this,
		depth = 0
		while (typeof current.parent != "string"){
			depth++
			current = current.parent
		}
		return depth
	}

	/**
	* Creates and adds a misccode object to allMyChildren
	*
	* @method addMiscCode
	* @return {MiscCode} misccode
	*/
	addMiscCode (itStr, newParent) {
    let aMisc = new MiscCode(itStr, newParent)
    this.allMyChildren.push(aMisc)
		return aMisc
  }

	/**
	* Adds the cloned item to allMyChildren
	*
	* @method addPastedItem
	*/
	addPastedItem(orig){
		var theClone
		if (orig.hasOwnProperty('allMyChildren')){
			if (orig.type === "Spec"){
				theClone = new Spec(orig.description, this)
			}
			else if (orig.type === "Suite"){
				theClone = new Suite(orig.description, this)
			}
			else if (orig.type === "BeforeEach"){
				theClone = new BeforeEach(this)
			}
			else if (orig.type === "AfterEach"){
				theClone = new AfterEach(this)
			}

			for (var i of orig.allMyChildren){
				if (i.type === "Spec"){
					var newSpec = new Spec(i.description, theClone)
					newSpec.allMyChildren = i.duplicateMyChildren(i, newSpec)
					theClone.allMyChildren.push(newSpec)
				}
				else if (i.type === "Suite"){
					var newSuite = new Suite(i.description, theClone)
					newSuite.allMyChildren = i.duplicateMyChildren(i, newSuite)
					theClone.allMyChildren.push(newSuite)
				}
				else if (i.type === "Assert"){
					var newAssert = new Assert(i.content, i.content2, theClone, i.not, i.matcher)
					theClone.allMyChildren.push(newAssert)
					theController.myModel.asserts.push(newAssert)
				}
				else if (i.type === "Misc"){
					var newCode = new MiscCode(i.content, theClone)
					theClone.allMyChildren.push(newCode)
				}
				else if (i.type === "BeforeEach"){
					var newBefore = new BeforeEach(theClone)
					newBefore.allMyChildren = newBefore.duplicateMyChildren(i, newBefore)
					theClone.allMyChildren.push(newBefore)
				}
				else if (i.type === "AfterEach"){
					var newAfter = new AfterEach(theClone)
					newAfter.allMyChildren = newAfter.duplicateMyChildren(i, newAfter)
					theClone.allMyChildren.push(newAfter)
				}
			}
		}
		else if (orig.type === "Assert"){
			theClone = new Assert(orig.content, orig.content2, this, orig.not, orig.matcher)
			theController.myModel.asserts.push(theClone)
		}
		else if (orig.type === "Misc"){
			theClone = new MiscCode(orig.content, this)
		}
		if (theClone.type === "BeforeEach" || theClone.type === "AfterEach"){
			this.allMyChildren.unshift(theClone)
			theController.updateDisplay()
			return
		}
		this.allMyChildren.push(theClone)
		theController.updateDisplay()
	}

	/**
	* Clones the child item
	*
	* @method cloneChild
	*/
	cloneChild(index, posAfterOrig = true){
		var orig = this.allMyChildren[index]
		var theClone
		if (orig.hasOwnProperty('allMyChildren')){
			if (orig.type === "Spec"){
				theClone = new Spec(orig.description, orig.parent)
			}
			else if (orig.type === "Suite"){
				theClone = new Suite(orig.description, orig.parent)
			}
			else if (orig.type === "BeforeEach"){
				theClone = new BeforeEach(orig.parent)
			}
			else if (orig.type === "AfterEach"){
				theClone = new AfterEach(orig.parent)
			}
			console.log(orig)
			for (var i of orig.allMyChildren){
				if (i.type === "Spec"){
					var newSpec = new Spec(i.description, theClone)
					newSpec.allMyChildren = i.duplicateMyChildren(i, newSpec)
					theClone.allMyChildren.push(newSpec)
				}
				else if (i.type === "Suite"){
					var newSuite = new Suite(i.description, theClone)
					newSuite.allMyChildren = i.duplicateMyChildren(i, newSuite)

					theClone.allMyChildren.push(newSuite)
				}
				else if (i.type === "Assert"){
					var newAssert = new Assert(i.content, i.content2, theClone, i.not, i.matcher)
					theClone.allMyChildren.push(newAssert)
					theController.myModel.asserts.push(newAssert)
				}
				else if (i.type === "Misc"){
					var newCode = new MiscCode(i.content, theClone)
					theClone.allMyChildren.push(newCode)
				}
				else if (i.type === "BeforeEach"){
					var newSetup = new BeforeEach(theClone)
					newSetup.allMyChildren = newSetup.duplicateMyChildren(i, newSetup)
					theClone.allMyChildren.push(newSetup)
				}
				else if (i.type === "AfterEach"){
					var newAfter = new AfterEach(theClone)
					newAfter.allMyChildren = newAfter.duplicateMyChildren(i, newAfter)
					theClone.allMyChildren.push(newAfter)
				}
			}
		}
		else if (orig.type === "Assert"){
			theClone = new Assert(orig.content, orig.content2, orig.parent, orig.not, orig.matcher)
			theController.myModel.asserts.push(theClone)
		}
		else if (orig.type === "Misc"){
			theClone = new MiscCode(orig.content, orig.parent)
		}

		//Place cloned item directly after its original?
		if (posAfterOrig) {
			this.allMyChildren.splice(index+1, 0, theClone)
		}
		else {
			this.allMyChildren.push(theClone)
		}

		theController.updateDisplay()

	}

	/**
	* Duplicates all children
	*
	* @method duplicateMyChildren
	* @return {array} newArray
	*/
	duplicateMyChildren(oldParent = this, newParent){
		console.log(oldParent)
		var newArray = []
		for (var i of oldParent.allMyChildren){
			if (i.type === "Spec"){
				var newSpec = new Spec(i.description, newParent)
				newSpec.allMyChildren = i.duplicateMyChildren(i, newSpec)
				newArray.push(newSpec)
			}
			else if (i.type === "Suite"){
				var newSuite = new Suite(i.description, newParent)
				newSuite.allMyChildren = i.duplicateMyChildren(i, newSuite)
				newArray.push(newSuite)
			}
			else if (i.type === "Assert"){
				var newAssert = new Assert(i.content, i.content2, newParent, i.not, i.matcher)
				newArray.push(newAssert)
				theController.myModel.asserts.push(newAssert)
			}
			else if (i.type === "Misc"){
				console.log("CLONE MISC C")
				var newMisc = new MiscCode(i.content, newParent)
				newArray.push(newMisc)
			}
			else if (i.type === "BeforeEach"){
				var newSetup = new BeforeEach(newParent)
				newSetup.allMyChildren = newSetup.duplicateMyChildren(i, newSetup)
				newArray.push(newSetup)
			}
			else if (i.type === "AfterEach"){
				var newAfter = new AfterEach(newParent)
				newAfter.allMyChildren = newAfter.duplicateMyChildren(i, newAfter)
				newArray.push(newAfter)
			}
		}
		return newArray
	}

	/**
	* Removes asserts
	*
	* @method findAssertForRemoval
	*/
	findAssertForRemoval(){
		for (var item of this.allMyChildren){
			if (item.type === "Assert"){
				let doesExist = theController.myModel.asserts.findIndex(x => x.id == item.id)
				if (doesExist != -1){
					theController.myModel.asserts.splice(doesExist, 1)
				}
			}
			if (item.hasOwnProperty('allMyChildren')){
				item.findAssertForRemoval()
			}
		}
	}

	/**
	* Removes child
	*
	* @method removeChild
	* @param {int} index
	*/
	removeChild(index){
		if (index > -1) {
			this.allMyChildren.splice(index, 1)
		}
	}
}
