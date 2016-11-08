/*
jshint esversion:6, jshint asi:true
*/
class MiscCode {
	constructor (contents, newParent = "None"){
		this.id = idGenerator()
		this.contents = contents
		this.parent = newParent
		this.type = "Misc"
	}

	toHTML(Parent){
		let backColour = 240-(this.findIndent() * 22)
		if (this.parent !== "None"){
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		if (backColour < 40) backColour = 40
		var newText = "<div class='Misc TestItem' ondrop='theController.myView.drop(event)' ondragstart='theController.myView.drag(event)' ondragover='theController.myView.allowDrop(event)' draggable='true' class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+");' id='" + this.id + "'>"
		newText += "&nbsp;&nbsp;" + "<textArea placeholder='Put your JavaScript code here...' class='input' draggable='false' onmousedown='theController.myView.changeDrag(false, true)' onmouseup='theController.myView.changeDrag(true, false)' onmouseleave='theController.myView.changeDrag(true)' rows='3' id='" + this.id + "t'>" + this.contents + "</textArea> </div>"
		theController.outputToDiv(Parent, newText)
		theController.myView.setItemClickListeners(this.id)
	}

    toString (tabNum) {
        let tab = "    "
				let lines = this.contents.split("\n")
        let resultStr = ""
				for (let i = 0; i < lines.length; i++){
					if (lines[i] == "") {
						lines.splice(i, 1)
					}
				}
				for (let i = 0; i < lines.length; i++){
					resultStr += tab.repeat(tabNum) + lines[i]
					if (i <= lines.length - 2){
						 resultStr += "\r\n"
					}
				}
        return resultStr
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
}
