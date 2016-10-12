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
		newText += " " +this.type + "&nbsp;&nbsp;" + "<textArea id='" + this.id + "t' type='text'>" + this.contents + "</textArea> | "+ this.id + "</div>"
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