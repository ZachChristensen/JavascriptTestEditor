/*jslint browser : true, continue : true,

  devel : true, indent : 2, maxerr : 50,

  newcap : true, nomen : true, plusplus : true,

  regexp : true, sloppy : true, vars : false,

  white : true, es6 : true

*/

/*
jshint esversion:6 
*/
/*
jshint asi:true
*/

//utility function

//For creating unique object IDs
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
		let newText = "<div class='suite' id='" + this.id + "'>"
		
		if (this.parent !== "None"){
			let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
			if (this.parent.parent !== "None"){
				newText += "<button onclick='jasmine.find(\"" + this.id + "\").moveOut()'>←</button>"
			}
			if (index != 0 && this.parent.allMyChildren[index-1].type == "Suite"){
				newText += "<button title='Move object into a suite above' onclick='jasmine.find(\"" + this.id + "\").moveIn()'>→</button>"
			}
			newText += "<button onclick='jasmine.find(\"" + this.id + "\").moveUp()'>↑</button>"
			newText += "<button onclick='jasmine.find(\"" + this.id + "\").moveDown()'>↓</button>"
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
			jasmine.toHTML()
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
			jasmine.toHTML()
			console.log(jasmine.allMyChildren)
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
		jasmine.toHTML()
	}
	
	moveDown(){
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)		
		if (index != this.parent.allMyChildren.length-1){
			var temp = this.parent.allMyChildren[index+1]
			this.parent.allMyChildren[index+1] = this.parent.allMyChildren[index]
			this.parent.allMyChildren[index] = temp
		}
		jasmine.toHTML()

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
 

class  TestingSuite {
	constructor (descriptionStr) {
		var theRoot = new Suite(descriptionStr)
		this.root = theRoot
		this.currentSuite = this.root
	}

	setCurrentSuite (suite) {
		this.currentSuite = suite
	}

	getCurrentSuite () {
		return this.currentSuite
	}

	addSuite (descriptionStr) {
		var aSuite, parent
		parent = this.getCurrentSuite()
		aSuite = new Suite(descriptionStr, parent)
		parent.allMyChildren.push(aSuite)
		this.setCurrentSuite(aSuite)
		return aSuite
	}

	addSpec (descriptionStr) {
		var parentSuite, aSpec
		parentSuite = this.getCurrentSuite()
		console.log(parentSuite)
		parentSuite.addChild(descriptionStr, parentSuite)
	}

	find (idStr) {
		if (this.root.id === idStr){
			return this.root
		}
		return this.root.findChild(idStr)
	}
	
	updateItem(elementID, newStr){
		this.find(elementID).description = newStr
		console.log(this.find(elementID))
	}

	toString () {
		return this.root.toString(0)
	}

	toHTML () {
		var HTMLdiv = document.getElementById('main')
		HTMLdiv.innerHTML = ""

		return this.root.toHTML('main')
	}
}


var jasmine = new TestingSuite("Root Suite")

window.addEventListener('input', function (e) {	
	let id = e.target.id.slice(0, -1)
	jasmine.updateItem(id, e.target.value)
}, false);

jasmine.addSpec("first Child spec")

var firstChild = jasmine.addSuite("firstChild Suite")

jasmine.setCurrentSuite(firstChild)

jasmine.addSpec("child of  child spec 1")

jasmine.addSpec("child of  child spec 2")

jasmine.addSpec("child of  child spec 3")

var childOfchild = jasmine.addSuite("childOfChild Suite")

console.log(jasmine)