/*
jshint esversion:6, asi:true
*/
class MiscCode {
	constructor (content, newParent = "None"){
		this.id = idGenerator()
		this.content = content
		this.parent = newParent
		this.type = "Misc"
	}

	toHTML(Parent){
		let backColour = 240-(this.findIndent() * 22)
		var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		if (backColour < 40) backColour = 40
		var newText = "<div class='Misc TestItem' ondrop='theController.myView.drop(event)' ondragstart='theController.myView.drag(event)' ondragend='theController.myView.dragEndCheck()' ondragover='theController.myView.allowDrop(event)' draggable='true' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+");' id='" + this.id + "'>"
		newText += '<div class="dropdown" style="position: absolute; top: 16px;"><button class="dropbtn">⇓</button><div class="dropdown-content">'

		newText += '<a class="btnDelete">Delete</a>'
		newText += '<a class="btnClone">Clone</a>'
		newText += '<a class="btnCopy">Copy</a>'
		newText += '<a class="btnCut">Cut</a>'
		//up
		if (index !== 0) newText += "<a title='Move object up' href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveUp()'>Move Up</a>"
		//down
		if (index !== (this.parent.allMyChildren.length - 1)) newText += "<a title='Move object down' href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveDown()' >Move Down</a>"

		newText += '</div></div>'
		newText += "&nbsp;&nbsp;" + "<textArea placeholder='Put your JavaScript code here...' class='input' draggable='false' onmousedown='theController.myView.changeDrag(false, true)' onmouseup='theController.myView.changeDrag(true, false)' ondragend='theController.myView.dragEndCheck()' onmouseleave='theController.myView.changeDrag(true)' rows='3' id='" + this.id + "t'>" + this.content + "</textArea> </div>"
		theController.outputToDiv(Parent, newText)
		theController.myView.setItemClickListeners(this.id)
	}

    toString (tabNum) {
        let tab = "    "
				let lines = this.content.split(/\r\n|\r|\n/)
        let resultStr = ""
				for (let i = 0; i < lines.length; i++){
					if (lines[i] === "") {
						lines.splice(i, 1)
					}else{
						lines[i] += ";"
					}
					if (i < lines.length - 1){
						lines[i] += "\r\n"
					}
				}
				for (let line of lines){
					resultStr += tab.repeat(tabNum) + line
				}
        return resultStr
    }

	moveUp(){
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		if (index !== 0){
			let temp = this.parent.allMyChildren[index-1]
			this.parent.allMyChildren[index-1] = this.parent.allMyChildren[index]
			this.parent.allMyChildren[index] = temp
		}
		theController.updateDisplay()
	}

	moveDown(){
		let index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		if (index != this.parent.allMyChildren.length-1){
			let temp = this.parent.allMyChildren[index+1]
			this.parent.allMyChildren[index+1] = this.parent.allMyChildren[index]
			this.parent.allMyChildren[index] = temp
		}
		theController.updateDisplay()
	}


	findIndent(){
		let current = this,
		depth = 0
		while (typeof current.parent != "string"){
			depth++
			current = current.parent
		}
		return depth
	}
}
