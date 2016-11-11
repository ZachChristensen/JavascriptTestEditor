/*
jshint esversion:6, jshint asi:true
*/
class TestItem {
	constructor ( newDesc, newType, newParent = "None") {
		this._description = newDesc
		this.type = newType
		this.id = idGenerator()
		this.parent = newParent
	}

	set description ( newDesc ){ this._description = newDesc }
	get description () { return this._description }

	toHTML(Parent){
		let backColour = 240-(this.findIndent() * 22)

		if (this.parent !== "None"){
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		//Name used to display
		if (this.type === "Suite") var name = theController.myModel.currentLanguage.suite
		else if (this.type === "Spec") var name = theController.myModel.currentLanguage.spec
		//ToDo if text gets too dark change font color?
		if (backColour < 60) backColour = 60
		if (typeof this.parent === "string") var newText = "<div ondrop='theController.myView.drop(event)' ondragend='theController.myView.dragEndCheck()' ondragstart='theController.myView.drag(event)' ondragover='theController.myView.allowDrop(event)' draggable='true' class='"+this.type+" TestItem' style='margin:1em 0' id='" + this.id + "'>"
		else var newText = "<div ondrop='theController.myView.drop(event)' ondragstart='theController.myView.drag(event)' ondragend='theController.myView.dragEndCheck()' ondragover='theController.myView.allowDrop(event)' draggable='true' class='"+this.type+" TestItem' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'
		newText += '<a class="btnDelete">Delete</a>'

		if (this.type === "Suite"){
			newText += '<a class="btnAddSpec">Add '+theController.myModel.currentLanguage.spec+'</a> <a class="btnAddSuite">Add '+theController.myModel.currentLanguage.suite+'</a>'
			newText += '<a class="btnAddBeforeEach">Add beforeEach</a>'
			newText += '<a class="btnAddAfterEach">Add afterEach</a>'
		}
		if (this.type === "Spec") newText += '<a class="btnAddAssert">Add Assert</a>'
		newText += '<a class="btnAddMisc">Add Code</a>'

		if (this.parent !== "None") newText += '<a class="btnClone">Clone</a>'
		newText += '<a class="btnCopy">Copy</a>'
		if (this.parent !== "None") newText += '<a class="btnCut">Cut</a>'

		if (this.hasOwnProperty("allMyChildren")) newText += '<a class="btnPaste">Paste</a>'
		if (this.parent !== "None"){
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

	moveIn(){
		//item above it becomes parent
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		//check index not negative
		if (index != 0 && this.parent.allMyChildren[index-1].type == "Suite"){
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

	moveUp(){
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		if (index !== 0){
			var temp = this.parent.allMyChildren[index-1]
			this.parent.allMyChildren[index-1] = this.parent.allMyChildren[index]
			this.parent.allMyChildren[index] = temp
		}
		theController.updateDisplay()
	}

	moveDown(){
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		if (index != this.parent.allMyChildren.length-1){
			var temp = this.parent.allMyChildren[index+1]
			this.parent.allMyChildren[index+1] = this.parent.allMyChildren[index]
			this.parent.allMyChildren[index] = temp
		}
		theController.updateDisplay()
	}

	findIndent(){
		var current = this,
		depth = 0
		while (typeof current.parent != "string"){
			depth++
			current = current.parent
		}
		return depth
	}

	addMiscCode (itStr, newParent) {
    let aMisc = new MiscCode(itStr, newParent)
    this.allMyChildren.push(aMisc)
		return aMisc
  }

	addPastedItem(orig){
		if (orig.hasOwnProperty('allMyChildren')){
			if (orig.type === "Spec"){
				var theClone = new Spec(orig.description, this)
			}
			else if (orig.type === "Suite"){
				var theClone = new Suite(orig.description, this)
			}
			else if (orig.type === "BeforeEach"){
				var theClone = new BeforeEach(this)
			}
			else if (orig.type === "AfterEach"){
				var theClone = new AfterEach(this)
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
					var newAssert = new Assert(i.contents, i.contents2, theClone, i.not, i.matcher)
					theClone.allMyChildren.push(newAssert)
					theController.myModel.asserts.push(newAssert)
				}
				else if (i.type === "Misc"){
					var newAssert = new MiscCode(i.contents, theClone)
					theClone.allMyChildren.push(newAssert)
				}
				else if (i.type === "BeforeEach"){
					var newSetup = new BeforeEach(theClone)
					newSetup.allMyChildren = newSetup.duplicateMyChildren(i, newSetup)
					theClone.allMyChildren.push(newSetup)
				}
				else if (i.type === "AfterEach"){
					var newSetup = new AfterEach(theClone)
					newSetup.allMyChildren = newSetup.duplicateMyChildren(i, newSetup)
					theClone.allMyChildren.push(newSetup)
				}
			}
		}
		else if (orig.type === "Assert"){
			var theClone = new Assert(orig.contents, orig.contents2, this, orig.not, orig.matcher)
			theController.myModel.asserts.push(theClone)
		}
		else if (orig.type === "Misc"){
			var theClone = new MiscCode(orig.contents, this)
		}
		if (theClone.type === "BeforeEach" || theClone.type === "AfterEach"){
			this.allMyChildren.unshift(theClone)
			theController.updateDisplay()
			return
		}
		this.allMyChildren.push(theClone)
		theController.updateDisplay()
	}

	cloneChild(index, posAfterOrig = true){
		var orig = this.allMyChildren[index]
		if (orig.hasOwnProperty('allMyChildren')){
			if (orig.type === "Spec"){
				var theClone = new Spec(orig.description, this)
			}
			else if (orig.type === "Suite"){
				var theClone = new Suite(orig.description, this)
			}
			else if (orig.type === "BeforeEach"){
				var theClone = new BeforeEach(this)
			}
			else if (orig.type === "AfterEach"){
				var theClone = new AfterEach(this)
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
					var newAssert = new Assert(i.contents, i.contents2, theClone, i.not, i.matcher)
					theClone.allMyChildren.push(newAssert)
					theController.myModel.asserts.push(newAssert)
				}
				else if (i.type === "Misc"){
					var newAssert = new MiscCode(i.contents, theClone)
					theClone.allMyChildren.push(newAssert)
				}
				else if (i.type === "BeforeEach"){
					var newSetup = new BeforeEach(theClone)
					newSetup.allMyChildren = newSetup.duplicateMyChildren(i, newSetup)
					theClone.allMyChildren.unshift(newSetup)
				}
				else if (i.type === "AfterEach"){
					var newSetup = new AfterEach(theClone)
					newSetup.allMyChildren = newSetup.duplicateMyChildren(i, newSetup)
					theClone.allMyChildren.unshift(newSetup)
				}
			}
		}
		else if (orig.type === "Assert"){
			var theClone = new Assert(orig.contents, orig.contents2, orig.parent, orig.not, orig.matcher)
			theController.myModel.asserts.push(theClone)
		}
		else if (orig.type === "Misc"){
			var theClone = new MiscCode(orig.contents, orig.parent)
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
				var newSuite = new Assert(i.contents, i.contents2, newParent, i.not, i.matcher)
				theController.myModel
				newArray.push(newSuite)
			}
			else if (i.type === "Misc"){
				var newMisc = new MiscCode(i.contents, newParent)
				newArray.push(newMisc)
			}
			else if (i.type === "BeforeEach"){
				var newSetup = new BeforeEach(newParent)
				newSetup.allMyChildren = newSetup.duplicateMyChildren(i, newParent)
				newArray.unshift(newSetup)
			}
			else if (i.type === "AfterEach"){
				var newSetup = new AfterEach(newParent)
				newSetup.allMyChildren = newSetup.duplicateMyChildren(i, newParent)
				newArray.unshift(newSetup)
			}
		}
		return newArray
	}

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

	removeChild(index){
		if (index > -1) {
			this.allMyChildren.splice(index, 1)
		}
	}
}
