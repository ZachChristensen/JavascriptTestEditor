class Assert {
	constructor (contents="", contents2="", newParent = "None", not=false, matcher="toBe"){
		this.id = idGenerator()
		this.contents = contents
		this.contents2 = contents2
		this.parent = newParent
		this.type = "Assert"
		this.not = not
		this.matcher = matcher
	}

	toHTMLString(outerDiv = true){
		let backColour = 240-(this.findIndent() * 20)
		if (this.parent !== "None"){
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		if (backColour < 40) backColour = 40
		if (outerDiv){
			var newText = "<div ondrop='theController.myView.drop(event)' ondragstart='theController.myView.drag(event)' ondragover='theController.myView.allowDrop(event)' draggable='true' class='"+this.type+"' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
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
		newText += " " + theController.myModel.currentLanguage.assert + "&nbsp;&nbsp;" + "(<input  class='input' draggable='false' onmousedown='theController.myView.changeDrag(false, true)' onmouseup='theController.myView.changeDrag(true, false)' onmouseleave='theController.myView.changeDrag(true)' style='min-width:180px; width: calc(100% - 650px);' id='" + this.id + "t1' type='text' value='" + this.contents + "'></input>)"
		newText += "<span>.</span><select id='"+this.id+"d1' onchange='theController.myView.assertDropdown(this)'>"
		newText += '<option disabled>Select...</option>'
		newText += "<option value='not'>not</option>"
		newText += "<option value='toBe'>toBe</option>"
		newText += "<option value='toEqual'>toEqual</option>"
		newText += "<option value='toMatch'>toMatch</option>"
		newText += "<option value='toBeDefined'>toBeDefined</option>"
		newText += "<option value='toBeUndefined'>toBeUndefined</option>"
		newText += "<option value='toBeNull'>toBeNull</option>"
		newText += "<option value='toBeTruthy'>toBeTruthy</option>"
		newText += "<option value='toBeFalsy'>toBeFalsy</option>"
		newText += "<option value='toContain'>toContain</option>"
		newText += "<option value='toBeLessThan'>toBeLessThan</option>"
		newText += "<option value='toBeGreaterThan'>toBeGreaterThan</option>"
		newText += "<option value='toBeCloseTo'>toBeCloseTo</option>"
		newText += "<option value='toThrow'>toThrow</option>"
		newText += "<option value='toThrowError'>toThrowError</option>"
		newText += "</select>"

		if(this.not){
			newText += "<span>.</span><select id='"+this.id+"d2' onchange='theController.myView.assertDropdown(this)'>"

			newText += '<option disabled>Select...</option>'
			newText += "<option value='toBe'>toBe</option>"
			newText += "<option value='toEqual'>toEqual</option>"
			newText += "<option value='toMatch'>toMatch</option>"
			newText += "<option value='toBeDefined'>toBeDefined</option>"
			newText += "<option value='toBeUndefined'>toBeUndefined</option>"
			newText += "<option value='toBeNull'>toBeNull</option>"
			newText += "<option value='toBeTruthy'>toBeTruthy</option>"
			newText += "<option value='toBeFalsy'>toBeFalsy</option>"
			newText += "<option value='toContain'>toContain</option>"
			newText += "<option value='toBeLessThan'>toBeLessThan</option>"
			newText += "<option value='toBeGreaterThan'>toBeGreaterThan</option>"
			newText += "<option value='toBeCloseTo'>toBeCloseTo</option>"
			newText += "<option value='toThrow'>toThrow</option>"
			newText += "<option value='toThrowError'>toThrowError</option>"
			newText += "</select>"
		}
		if (this.matcher === "toBe" || this.matcher === "toEqual" || this.matcher === "toMatch" || this.matcher === "toContain" || this.matcher === "toBeLessThan" || this.matcher === "toBeGreaterThan" || this.matcher === "toBeCloseTo" || this.matcher === "toThrowError"){
			newText += "(<input class='input' draggable='false' onmousedown='changeDrag(false, true)' onmouseup='changeDrag(true, false)' onmouseleave='(changeDrag(true))' style='width: calc(100% - 660px); min-width:180px;' id='" + this.id + "t2' type='text' value='" + this.contents2 + "'></input>)"
		}
		else newText += "( )"


		if (outerDiv){
			newText += "</div>"
		}
		return newText
	}


	setCurrentDropdown(){
		console.log('setdropdown')
		console.log(this)

		if (this.not){
			console.log('not')
			var dropdwn = document.getElementById(this.id+"d2")
			for (var i = 0; i < dropdwn.options.length; i++) {
				if (dropdwn.options[i].text === this.matcher) {
					dropdwn.selectedIndex = i
					break
				}
			}
			dropdwn = document.getElementById(this.id+"d1")
			dropdwn.selectedIndex = 1
		}
		else{
			console.log('normal')
			var dropdwn = document.getElementById(this.id+"d1")
			console.log(dropdwn)
			for (var i of dropdwn.options) {
				if (i.value === this.matcher) {
					dropdwn.value = i.value
					break
				}
			}
		}
	}

	toHTML(Parent){
		theController.outputToDiv(Parent, this.toHTMLString())
		theController.myView.setItemClickListeners(this.id)
	}

    toString (tabNum) {
        let tab = "    "
		if (this.matcher === "toBe" || this.matcher === "toEqual" || this.matcher === "toMatch" || this.matcher === "toContain" || this.matcher === "toBeLessThan" || this.matcher === "toBeGreaterThan" || this.matcher === "toBeCloseTo" || this.matcher === "toThrowError"){
			if (this.not){
				var resultStr = tab.repeat(tabNum) + theController.myModel.currentLanguage.assert + "(" + this.contents + ").not" + '.' + this.matcher + "(" + this.contents2 + ")"
			}
			else{
				var resultStr = tab.repeat(tabNum) + theController.myModel.currentLanguage.assert + "(" + this.contents + ")" + '.' + this.matcher + "(" + this.contents2 + ")"
			}
		}
		else{
			if (this.not){
				var resultStr = tab.repeat(tabNum) + theController.myModel.currentLanguage.assert + "(" + this.contents + ").not" + '.' + this.matcher + "()"
			}
			else{
				var resultStr = tab.repeat(tabNum) + theController.myModel.currentLanguage.assert + "(" + this.contents + ")" + '.' + this.matcher + "()"
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

	dropdownSelected(value, isFirstDropdwn){
		if (isFirstDropdwn){
			this.not = false
		}
		this.matcher = value
		theController.myView.setToDiv(this.id, this.toHTMLString(false))
		this.setCurrentDropdown()
		theController.setButtonOnlicks()
	}

	notSelected(){
		this.not = true
		theController.myView.setToDiv(this.id, this.toHTMLString(false))
		theController.setButtonOnlicks()
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
