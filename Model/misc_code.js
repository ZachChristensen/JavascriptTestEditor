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
		var newText = "<div ondrop='drop(event)' ondragstart='drag(event)' ondragover='allowDrop(event)' draggable='true' class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+"); position: relative;' id='" + this.id + "'>"
		newText += '<div class="dropdown" style="position: absolute; top: 16px;"><button class="dropbtn">⇓</button><div class="dropdown-content">'

		newText += '<a class="btnDelete">Delete</a>'
		if (this.parent !== "None"){
			//up
			if (index !== 0) newText += "<a title='Move object up' href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveUp()'>Move Up</a>"
			//down
			if (index !== (this.parent.allMyChildren.length - 1)) newText += "<a title='Move object down' href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveDown()' >Move Down</a>"
		}

		newText += '</div></div>'
		newText += "&nbsp;&nbsp;" + "<textArea  draggable='false' onmousedown='changeDrag(false, true)' onmouseup='changeDrag(true, false)' onmouseleave='(changeDrag(true))' rows='3' id='" + this.id + "t' type='text' style='overflow: auto; margin-left:2.5em; min-height:40px; width: calc(100% - 115px); resize: vertical;'>" + this.contents + "</textArea> | "+ this.id + "</div>"
		theController.outputToDiv(Parent, newText)
		theController.myView.setItemClickListeners(this.id)
	}

    toString (tabNum) {
        console.log(undefined.type)
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
