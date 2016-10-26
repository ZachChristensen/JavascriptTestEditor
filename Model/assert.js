class Assert {
	constructor (contents, newParent = "None"){
		this.id = idGenerator()
		this.contents = contents
		this.parent = newParent
		this.type = "Assert"
		this.not = false
		this.matcher = ".toBe"
	}

	toHTMLString(outerDiv = true){
		let backColour = 240-(this.findIndent() * 20)
		if (this.parent !== "None"){
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		if (backColour < 40) backColour = 40
		if (outerDiv){
			var newText = "<div ondrop='drop(event)' ondragstart='drag(event)' ondragover='allowDrop(event)' draggable='true' class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		}
		else{
			var newText = ""
		}
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'
		
		newText += '<a class="btnDelete">Delete</a>'

		newText += '<a class="btnClone" >Clone</a>'
		if (this.parent !== "None"){
			//up
			if (index !== 0) newText += "<a title='Move object up' href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveUp()'>Move Up</a>"
			//down
			if (index !== (this.parent.allMyChildren.length - 1)) newText += "<a title='Move object down' href='javascript:;' onclick='theController.myModel.find(\"" + this.id + "\").moveDown()' >Move Down</a>"
		}

		newText += '</div></div>'
		newText += " " + theController.myModel.currentLanguage.assert + "&nbsp;&nbsp;" + "(<input style='width: calc(100% - 400);' id='" + this.id + "t' type='text' value='" + this.contents + "'></input>)"
		newText += "<select id='"+this.id+"d1' onchange='assertDropdown(this)'>"
		
		//if (this.not){
			//newText += '<option disabled>Select...</option>'
			//newText += "<option value='.not'>.not</option>"
		//}
		//else{
			newText += '<option selected disabled>Select...</option>'
			newText += "<option value='.not'>.not</option>"
		//}
		newText += "<option value='.toBe'>.toBe</option>"
		newText += "<option value='.toEqual'>.toEqual</option>"
		newText += "<option value='.toMatch'>.toMatch</option>"
		newText += "<option value='.toBeDefined'>.toBeDefined</option>"
		newText += "<option value='.toBeUndefined'>.toBeUndefined</option>"
		newText += "<option value='.toBeNull'>.toBeNull</option>"
		newText += "<option value='.toBeTruthy'>.toBeTruthy</option>"
		newText += "<option value='.toBeFalsy'>.toBeFalsy</option>"
		newText += "<option value='.toContain'>.toContain</option>"
		newText += "<option value='.toBeLessThan'>.toBeLessThan</option>"
		newText += "<option value='.toBeGreaterThan'>.toBeGreaterThan</option>"
		newText += "<option value='.toBeCloseTo'>.toBeCloseTo</option>"
		newText += "<option value='.toThrow'>.toThrow</option>"
		newText += "<option value='.toThrowError'>.toThrowError</option>"
		newText += "</select>"
		
		if(this.not){
			newText += "<select id='"+this.id+"d2' onchange='assertDropdown(this)'>"
			
			newText += '<option disabled>Select...</option>'			
			newText += "<option value='.toBe'>.toBe</option>"
			newText += "<option value='.toEqual'>.toEqual</option>"
			newText += "<option value='.toMatch'>.toMatch</option>"
			newText += "<option value='.toBeDefined'>.toBeDefined</option>"
			newText += "<option value='.toBeUndefined'>.toBeUndefined</option>"
			newText += "<option value='.toBeNull'>.toBeNull</option>"
			newText += "<option value='.toBeTruthy'>.toBeTruthy</option>"
			newText += "<option value='.toBeFalsy'>.toBeFalsy</option>"
			newText += "<option value='.toContain'>.toContain</option>"
			newText += "<option value='.toBeLessThan'>.toBeLessThan</option>"
			newText += "<option value='.toBeGreaterThan'>.toBeGreaterThan</option>"
			newText += "<option value='.toBeCloseTo'>.toBeCloseTo</option>"
			newText += "<option value='.toThrow'>.toThrow</option>"
			newText += "<option value='.toThrowError'>.toThrowError</option>"
		}
		
		if (outerDiv){
			newText += " | " + this.id +"</div>"
		}
		return newText
	}
	
	setCurrentDropdown(){
		if (this.not){
			var a = document.getElementById(this.id+"d2")
			

			var textToFind = this.matcher;

			var dd = a;
			for (var i = 0; i < dd.options.length; i++) {
				if (dd.options[i].text === textToFind) {
					dd.selectedIndex = i;
					break;
				}
			}
			
			a = document.getElementById(this.id+"d1")
			textToFind = this.matcher;
			a.selectedIndex = 1
		}
		else{
			var a = document.getElementById(this.id+"d1")
			var textToFind = this.matcher;

			var dd = a;
			for (var i = 0; i < dd.options.length; i++) {
				if (dd.options[i].text === textToFind) {
					dd.selectedIndex = i;
					break;
				}
			}
			console.log("assert not not dr")
		}
	}
	
	toHTML(Parent){
		theController.outputToDiv(Parent, this.toHTMLString())
		newText += " " + theController.myModel.currentLanguage.assert + "&nbsp;&nbsp;" + "<input draggable='false' onmousedown='changeDrag(false, true)	' onmouseup='changeDrag(true, false)' onmouseleave='(changeDrag(true))' style='width: calc(100% - 160px);' id='" + this.id + "t' type='text' value='" + this.contents + "'></input> | "+ this.id + "</div>"
		theController.outputToDiv(Parent, newText)
		theController.myView.setItemClickListeners(this.id)
		console.log("assert tohtml")
		this.setCurrentDropdown()
	}

    toString (tabNum) {
        let tab = "    "
        let resultStr = tab.repeat(tabNum) + this.contents
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

	dropdownSelected(value, isFirstDropdwn){
		if (isFirstDropdwn){
			this.not = false
		}
		theController.myView.setToDiv(this.id, this.toHTMLString(false))
		this.matcher = value
		this.setCurrentDropdown()
	} 
	
	notSelected(){
		this.not = true
		theController.myView.setToDiv(this.id, this.toHTMLString(false))
		this.setCurrentDropdown()
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
