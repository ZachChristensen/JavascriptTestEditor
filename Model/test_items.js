function idCounter() {
    var i = 0;
    return function() {
        return "Item" + i++;
    }
}

var idGenerator = idCounter();

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
		//ToDo if text gets too dark change font color?
		if (backColour < 60) backColour = 60
		if (this.parent == "None") var newText = "<div class='"+this.type+"' style='margin:1em 0' id='" + this.id + "'>"
		else var newText = "<div class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'

		newText += '<a class="btnDelete" href="#">Delete</a>'

		if (this.type === "Suite"){
			newText += '<a class="btnAddSpec" href="#">Add Spec</a> <a href="#" class="btnAddSuite">Add Suite</a>'
			newText += '<a class="btnAddBeforeEach" href="#">Add BeforeEach</a>'
			newText += '<a class="btnAddAfterEach" href="#">Add AfterEach</a>'
		}
		if (this.type === "Spec") newText += '<a class="btnAddAssert" href="#">Add Assert</a> <a class="btnAddMisc" href="#">Add Misc</a>' 

		if (this.parent !== "None") newText += '<a class="btnClone" href="#">Clone</a>'
		newText += '<a class="btnCopy" href="#">Copy</a>'
		if (this.parent !== "None") newText += '<a class="btnCut" href="#">Cut</a>'

		if (this.type === "Suite") newText += '<a class="btnPaste" href="#">Paste</a>'

		if (this.parent !== "None"){
			//out
			if (this.parent.parent !== "None") newText += "<a href='javascript:;' onclick='TC.myModel.find(\"" + this.id + "\").moveOut()' title='Move object out along side it&apos;s containing suite'>Move Out</a>"
			//in
			if (index !== 0 && this.parent.allMyChildren[index-1].type === "Suite") newText += "<a title='Move object into a suite above' href='javascript:;' onclick='TC.myModel.find(\"" + this.id + "\").moveIn()' >Move In</a>"
			//up
			if (index !== 0) newText += "<a title='Move object up' href='javascript:;' onclick='TC.myModel.find(\"" + this.id + "\").moveUp()'>Move Up</a>"
			//down
			if (index !== (this.parent.allMyChildren.length - 1)) newText += "<a title='Move object down' href='javascript:;' onclick='TC.myModel.find(\"" + this.id + "\").moveDown()' >Move Down</a>"
		}
		newText += '</div></div>'
		newText += " " +this.type + "&nbsp;&nbsp;" + "<input id='" + this.id + "t' type='text' value='" + this.description + "'></input> | "+ this.id + "</div>"
		TC.outputToDiv(Parent, newText)
		if (this.type === "Suite"){
			if (this.myBefore != undefined) this.myBefore.toHTML(this.id)
			if (this.myAfter != undefined) this.myAfter.toHTML(this.id)
		}
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
			TC.updateDisplay()
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
			TC.updateDisplay()
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
		TC.updateDisplay()
	}

	moveDown(){
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		if (index != this.parent.allMyChildren.length-1){
			var temp = this.parent.allMyChildren[index+1]
			this.parent.allMyChildren[index+1] = this.parent.allMyChildren[index]
			this.parent.allMyChildren[index] = temp
		}
		TC.updateDisplay()
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
		//check if it can have children
		if (this.type == "Spec" || this.type == "Suite"){
			var orig = theItem
			if (this.type === "Spec" && orig.type === "Assert"){
				var theClone = new Assert(orig.contents, this)
			}
			else if(orig.type === "Spec"){
				var theClone = new Spec(orig.description, this)
			}
			else if (orig.type === "Suite"){
				var theClone = new Suite(orig.description, this)
				for (var i of orig.allMyChildren){
					if (i.type === "Spec"){
						console.log(theClone)
						let newSpec = new Spec(i.description, theClone)
						console.log(newSpec)
						theClone.addSpec(i.description, theClone)
					}
					else if (i.type === "Suite"){
						var newSuite = new Suite(i.description, theClone)
						newSuite.allMyChildren = i.duplicateMyChildren(i, newSuite)
						theClone.allMyChildren.push(newSuite)
					}
				}
			}
			this.allMyChildren.push(theClone)
			TC.updateDisplay()
		}
	}

	cloneChild(index){
		var orig = this.allMyChildren[index]
		console.log(orig)
		if (orig.hasOwnProperty('allMyChildren')){
			if (orig.type === "Spec"){
				var theClone = new Spec(orig.description, this)
			}
			else{
				var theClone = new Suite(orig.description, this)
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
			}
		}
		else if (orig.type === "Assert"){
			var theClone = new Assert(orig.contents, this)
		}
		else if (i.type === "Misc"){
			var theClone = new MiscCode(i.contents, theClone)
		}
		console.log("clone! " + theClone)
		this.allMyChildren.splice(index+1, 0, theClone)
		TC.updateDisplay()
	}

	duplicateMyChildren(oldParent = this, newParent){
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
				var newSuite = new MiscCode(i.contents, newParent)
				newArray.push(newSuite)
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

class Suite extends TestItem{
	constructor (newDesc, newParent = "None") {
		console.log(newParent)
		super(newDesc, "Suite", newParent)
		this.allMyChildren = []
		this.myBefore = undefined
		this.myAfter = undefined
	}

    addBefore () {
		this.myBefore = new BeforeEach(this)
	}

    addAfter () {
        this.myAfter = new AfterEach(this)
    }

	addSpec (itStr, newParent) {
		let aSpec = new Spec(itStr, newParent)
		this.allMyChildren.push(aSpec)
        return aSpec
	}

	addSuite (itStr, newParent) {
		let aSuite = new Suite(itStr, newParent)
		this.allMyChildren.push(aSuite)
	}

    toString (tabNum) {
		var resultStr, theTab, child
		var tab = "    "
		theTab = tabNum
		resultStr = tab.repeat(theTab) + "describe(\"" + this.description + "\", function() {\r\n"
		theTab = theTab + 1
        //if (this.myBefore != undefined) {
        //  resultStr += this.myBefore.toString() + "\r\n"
        //}

        //if (this.myAfter != undefined) {
        //  resultStr += this.myAfter.toString() + "\r\n"
        //}

		for (child of this.allMyChildren) {
			resultStr +=  child.toString(theTab)
		}
		resultStr += tab.repeat(theTab - 1) + "})\r\n"
		return resultStr
	}

	findChild (theId){
		for (var child of this.allMyChildren){
			if (child.id === theId){
				console.log(child.description + " found")
				return child
			}
			else{
				if(child.hasOwnProperty('allMyChildren')){
					let result = child.findChild(theId)
					if(result !== undefined){
						console.log(result.description + " found")
						return result
					}
				}
			}
		}
	}
}

class Setup extends Suite{
	constructor (newParent) {
		super("", newParent)
		this.type = "Setup"
	}	
	toHTML(Parent){
		console.log(this)
		let backColour = 240-(this.findIndent() * 20)
		if (this.parent !== "None"){
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		if (backColour < 40) backColour = 40
		var newText = "<div class='Setup' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'
		newText += '<a class="btnDelete" href="#">Delete</a>'		
		newText += '</div></div>'
		newText += " " +this.type + "&nbsp;&nbsp;" + "| "+ this.id + "</div>"
		TC.outputToDiv(Parent, newText)
		if(this.hasOwnProperty("allMyChildren")){
			for (var baby of this.allMyChildren){
				baby.toHTML(this.id)
			}
		}
	}
	
	toString (tabNum) {
        let tab = "    "
		var theTab, child
		theTab = tabNum

        let resultStr = tab.repeat(tabNum) + this.type + "(function() {\r\n"
        for (child of this.allMyChildren) {
            resultStr += child.toString(theTab) + "\r\n"
        }
        resultStr += tab.repeat(theTab - 1) + "})\r\n"
        return resultStr
    }
}

class BeforeEach extends Setup{
	constructor (newParent) {
		super(newParent)
		this.type = "BeforeEach"
	}
    
    addMiscCode (itStr, newParent) {
        let aMisc = new MiscCode(itStr, newParent)
        this.allMyChildren.push(aMisc)
    }
}

class AfterEach extends Setup{
	constructor (newParent) {
		super(newParent)
		this.type = "AfterEach"
	}
}


class Assert {
	constructor (contents, newParent = "None"){
		this.id = idGenerator()
		this.contents = contents
		this.parent = newParent
		this.type = "Assert"
	}

	toHTML(Parent){
		let backColour = 240-(this.findIndent() * 20)
		if (this.parent !== "None"){
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		if (backColour < 40) backColour = 40
		var newText = "<div class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'

		newText += '<a class="btnDelete" href="#">Delete</a>'

		newText += '<a class="btnClone" href="#">Clone</a>'

		newText += '</div></div>'
		newText += " " +this.type + "&nbsp;&nbsp;" + "<input id='" + this.id + "t' type='text' value='" + this.contents + "'></input> | "+ this.id + "</div>"
		TC.outputToDiv(Parent, newText)
	}
    toString (tabNum) {
        let tab = "    "
        let resultStr = tab.repeat(tabNum) + this.contents
        return resultStr
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
}

class MiscCode {
	constructor (contents, newParent = "None"){
		this.id = idGenerator()
		this.contents = contents
		this.parent = newParent
		this.type = "Misc"
	}

	toHTML(Parent){
		let backColour = 240-(this.findIndent() * 20)
		if (this.parent !== "None"){
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		if (backColour < 40) backColour = 40
		var newText = "<div class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'

		newText += '<a class="btnDelete" href="#">Delete</a>'

		newText += '</div></div>'
		newText += " " +this.type + "&nbsp;&nbsp;" + "<input id='" + this.id + "t' type='text' value='" + this.contents + "'></input> | "+ this.id + "</div>"
		TC.outputToDiv(Parent, newText)
	}

    toString (tabNum) {
        let tab = "    "
        let resultStr = tab.repeat(tabNum) + this.contents
        return resultStr
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
}

class Spec extends TestItem {
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Spec", newParent)
		this.allMyChildren = []
	}

	addAssert (contents, newParent) {
		let aAssert = new Assert(contents, newParent)
		this.allMyChildren.push(aAssert)
	}

    toString (tabNum) {
        var resultStr, theTab, child
        var tab = "    "
        theTab = tabNum
        resultStr = tab.repeat(theTab) + "it(\"" + this.description + "\", function() {\r\n"
        theTab = theTab + 1
        for (child of this.allMyChildren) {
            resultStr +=  child.toString(theTab)  + "\r\n"
        }
        resultStr += tab.repeat(theTab - 1) + "})\r\n"
        return resultStr
    }
    addAssert (contents, newParent) {
        let aAssert = new Assert(contents, newParent)
        this.allMyChildren.push(aAssert)
    }

    addMiscCode (itStr, newParent) {
        let aMisc = new MiscCode(itStr, newParent)
        this.allMyChildren.push(aMisc)
    }

	findChild (theId){
		for (var child of this.allMyChildren){
			if (child.id === theId){
				return child
			}
			else{
				if(child.hasOwnProperty('allMyChildren')){
					let result = child.findChild(theId)
					if(result !== undefined){
						console.log(result.description + " found")
						return result
					}
				}
			}
		}
	}
}
