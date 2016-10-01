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
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		if (backColour < 0) backColour = 0
		if (this.parent == "None") var newText = "<div class='"+this.type+"' style='margin:1em 0' id='" + this.id + "'>"
		else var newText = "<div class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'
		if (this.type === "Suite") newText += '<a class="btnAddSpec" href="#">Add Spec</a><a href="#" class="btnAddSuite">Add Suite</a>'
		
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
 
 
class Spec extends TestItem { 
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Spec", newParent)
	}
}


class Suite extends TestItem{
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Suite", newParent)
		this.allMyChildren = [] 
	}

	addSpec (itStr, newParent) {
		let aSpec = new Spec(itStr, newParent)
		this.allMyChildren.push(aSpec)
	}
	
	addSuite (itStr, newParent) {
		let aSuite = new Suite(itStr, newParent)
		this.allMyChildren.push(aSuite)
	}
	
	removeChild(index){
		//TODO 
	}
	
	findChild (theId){
		for (var child of this.allMyChildren){
			if (child.id === theId){
				console.log(child.description + " found")
				return child
			}
			else{
				if(child.hasOwnProperty("allMyChildren")){
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
