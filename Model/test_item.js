class TestItem {
	constructor ( newDesc, newType, newParent = "None") {
		this.description = newDesc
		this.type = newType
		this.id = idGenerator()
		this.parent = newParent
	}

	setDescription ( newDesc ){
		this.description = newDesc
	}

	getDescription(){
		return this.description
	}

	toHTML(Parent){
		let backColour = 240-(this.findIndent() * 20)
		if (this.parent !== "None"){
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		//Name used to display
		if (this.type === "Suite") var name = theController.myModel.currentLanguage.suite
		else if (this.type === "Spec") var name = theController.myModel.currentLanguage.spec

		//ToDo if text gets too dark change font color?
		if (backColour < 60) backColour = 60
		if (this.parent == "None") var newText = "<div ondrop='drop(event)' ondragstart='drag(event)' ondragover='allowDrop(event)' draggable='true' class='"+this.type+"' style='margin:1em 0' id='" + this.id + "'>"
		else var newText = "<div ondrop='drop(event)' ondragstart='drag(event)' ondragover='allowDrop(event)' draggable='true' class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'

		newText += '<a class="btnDelete">Delete</a>'

		if (this.type === "Suite"){
			newText += '<a class="btnAddSpec">Add Spec</a> <a class="btnAddSuite">Add Suite</a>'
			newText += '<a class="btnAddBeforeEach">Add BeforeEach</a>'
			newText += '<a class="btnAddAfterEach">Add AfterEach</a>'
		}
		if (this.type === "Spec") newText += '<a class="btnAddAssert">Add Assert</a>'
		newText += '<a class="btnAddMisc">Add Misc</a>'

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
			newText += " " + name + "&nbsp;&nbsp;" + "<input style='width: calc(100% - 180px);' id='" + this.id + "t' type='text' value='" + this.description + "'></input> | "+ this.id + "</div>"
		}
		else{
			newText += " " + name + "&nbsp;&nbsp;" + "<input style='width: calc(100% - 120px);' id='" + this.id + "t' type='text' value='" + this.description + "'></input> | "+ this.id + "</div>"
		}
		theController.outputToDiv(Parent, newText)
		if(this.hasOwnProperty("allMyChildren")){
			for (var baby of this.allMyChildren){
				baby.toHTML(this.id)
			}
		}
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
		while (current.parent != "None"){
			depth++
			current = current.parent
		}
		return depth
	}

	addMiscCode (itStr, newParent) {
        let aMisc = new MiscCode(itStr, newParent)
        this.allMyChildren.push(aMisc)
    }

	addPastedItem(theItem){
		var orig = theItem;
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
					var newAssert = new Assert(i.contents, theClone)
					theClone.allMyChildren.push(newAssert)
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
			var theClone = new Assert(orig.contents, this)
		}
		else if (i.type === "Misc"){
			var theClone = new MiscCode(i.contents, theClone)
		}
		this.allMyChildren.push(theClone)
		theController.updateDisplay()

	}

	cloneChild(index){
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
					var newAssert = new Assert(i.contents, theClone)
					theClone.allMyChildren.push(newAssert)
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
			var theClone = new Assert(orig.contents, this)
		}
		else if (i.type === "Misc"){
			var theClone = new MiscCode(i.contents, theClone)
		}
		this.allMyChildren.splice(index+1, 0, theClone)
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
				var newSuite = new Assert(i.contents, newParent)
				newArray.push(newSuite)
			}
			else if (i.type === "Misc"){
				var newMisc = new MiscCode(i.contents, newParent)
				newArray.push(newMisc)
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
		return newArray
	}

	removeChild(index){
		if (index > -1) {
			this.allMyChildren.splice(index, 1);
		}
	}
}
