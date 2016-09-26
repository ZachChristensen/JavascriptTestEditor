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
		if (backColour < 0) backColour = 0
		let newText = "<div class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		
		if (this.parent !== "None"){
			let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
			
			//out
			newText += "<button onclick='TC.myModel.find(\"" + this.id + "\").moveOut()'"
			if (this.parent.parent == "None") newText += " disabled"
			newText += ">←</button>"
			
			//in
			newText += "<button title='Move object into a suite above' onclick='TC.myModel.find(\"" + this.id + "\").moveIn()'"
			if (index == 0 || this.parent.allMyChildren[index-1].type !== "Suite") newText += " disabled"
			newText += ">→</button>"
			
			//up
			newText += "<button onclick='TC.myModel.find(\"" + this.id + "\").moveUp()'"
			if (index == 0) newText += " disabled"
			newText += ">↑</button>"
			
			//down
			newText += "<button onclick='TC.myModel.find(\"" + this.id + "\").moveDown()'"
			if (index == (this.parent.allMyChildren.length - 1)) newText += " disabled"
			newText += ">↓</button>"
		}
		
		let HTMLParent = document.getElementById(Parent)
		newText += this.type + "&nbsp;&nbsp;" + "<input id='" + this.id + "t' type='text' value='" + this.description + "'></input> | "+ this.id + "</div>"
		HTMLParent.innerHTML += newText
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
			TC.myModel.toHTML()
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
			TC.myModel.toHTML()
			console.log(TC.myModel.allMyChildren)
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
		TC.myModel.toHTML()
	}
	
	moveDown(){
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)		
		if (index != this.parent.allMyChildren.length-1){
			var temp = this.parent.allMyChildren[index+1]
			this.parent.allMyChildren[index+1] = this.parent.allMyChildren[index]
			this.parent.allMyChildren[index] = temp
		}
		TC.myModel.toHTML()
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

	addChild (itStr, newParent) {
		let aSpec = new Spec(itStr, newParent)
		this.allMyChildren.push(aSpec)
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
