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
		let backColour = 240-(this.findIndent() * 30)
		if (this.parent !== "None"){
			console.log(this.parent)
			console.log(this.id)
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		if (backColour < 40) backColour = 40
		if (this.parent == "None") var newText = "<div class='"+this.type+"' style='margin:1em 0' id='" + this.id + "'>"
		else var newText = "<div class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'

		newText += '<a class="btnDelete" href="#">Delete</a>'

		if (this.type === "Suite") newText += '<a class="btnAddSpec" href="#">Add Spec</a><a href="#" class="btnAddSuite">Add Suite</a>'

		if (this.parent !== "None"){
			newText += '<a class="btnClone" href="#">Clone</a>'
			newText += '<a class="btnCopy" href="#">Copy</a>'
			newText += '<a class="btnCut" href="#">Cut</a>'
			if (this.type === "Suite") newText += '<a class="btnPaste" href="#">Paste</a>'
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
		if(this.hasOwnProperty("allMyChildren")){
			for (var baby of this.allMyChildren){
				baby.toHTML(this.id)
			}
		}
	}

	moveIn(){
		//item above it becomes parent
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		console.log("IN:")
		console.log("index:"+index)
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
		//moves out along side parent unless parent is root.
		if (this.parent.hasOwnProperty('parent') && this.parent.parent != "None"){
			let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
			console.log("index:"+index)
			let me = this.parent.allMyChildren[index]
			this.parent.allMyChildren.splice(index, 1)
			this.parent = this.parent.parent
			this.parent.allMyChildren.push(me)
			console.log("OUT!")
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
}

class Suite extends TestItem{
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Suite", newParent)
		this.allMyChildren = []
		this.myBefore = undefined
		this.myAfter = undefined
	}

	addSetup (type, contents) {
		let aSetup = new Setup(type, contents)
		this.allMyChildren.push(aSetup)
	}

	addSpec (itStr, newParent, asserts) {
		let aSpec = new Spec(itStr, newParent, asserts)
		this.allMyChildren.push(aSpec)
	}

	addSuite (itStr, newParent) {
		let aSuite = new Suite(itStr, newParent)
		this.allMyChildren.push(aSuite)
	}

	removeChild(index){
		if (index > -1) {
			this.allMyChildren.splice(index, 1);
		}
	}
	
	addPastedItem(theItem){
		var orig = theItem
		if (orig.type === "Spec"){
			var theClone = new Spec(orig.description, this)
		}
		else if (orig.type === "Suite"){
			var theClone = new Suite(orig.description, this)
			for (var i of orig.allMyChildren){
				if (i.type === "Spec"){
					console.log("LOOK")
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
	
	cloneChild(index){
		var orig = this.allMyChildren[index]
		if (orig.type === "Spec"){
			var theClone = new Spec(orig.description, this)
		}
		else if (orig.type === "Suite"){
			var theClone = new Suite(orig.description, this)
			for (var i of orig.allMyChildren){
				if (i.type === "Spec"){
					console.log("LOOK")
					console.log(theClone)
					theClone.addSpec(i.description, theClone)
				}
				else if (i.type === "Suite"){
					var newSuite = new Suite(i.description, theClone)
					newSuite.allMyChildren = i.duplicateMyChildren(i, newSuite)
					theClone.allMyChildren.push(newSuite)
				}
				
			}
		}
		this.allMyChildren.splice(index+1, 0, theClone)
		TC.updateDisplay()
	}
	
	duplicateMyChildren(oldParent = this, newParent){
		var newArray = []
		for (var i of oldParent.allMyChildren){
			if (i.type === "Spec"){
				newArray.push(new Spec(i.description, newParent))
			}
			else if (i.type === "Suite"){
				var newSuite = new Suite(i.description, newParent)
				newSuite.allMyChildren = i.duplicateMyChildren(i, newSuite)
				newArray.push(newSuite)
			}
		}
		return newArray
	}
	
	toString (tabNum) {
		var resultStr, theTab, child
		var tab = "    "
		theTab = tabNum
		resultStr = tab.repeat(theTab) + "describe(\"" + this.description + "\", function() {\r\n"
		theTab = theTab + 1
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
				if(child.type === "Suite"){
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
	constructor (newParent){
		super("", newParent)
		this.type = "Setup"
	}
}

class Assert {
	constructor (contents){
		this.contents = contents
	}
}

class Spec extends TestItem {
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Spec", newParent)
		this.allMyChildren = []
	}

  toString (tabNum) {
    let tab = "    "
    let resultStr = tab.repeat(tabNum) + "it(\"" + this.description + "\", function() {\r\n"
      + tab.repeat(tabNum + 1) + "expect(true).toBe(true)\r\n"
      + tab.repeat(tabNum) + "})\r\n"
    return resultStr
  }
}


