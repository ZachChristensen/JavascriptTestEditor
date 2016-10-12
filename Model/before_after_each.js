class Setup extends Suite{
	constructor (newParent) {
		super("", newParent)
		this.type = "Setup"
	}	
	toHTML(Parent){
		let backColour = 240-(this.findIndent() * 20)
		if (this.parent !== "None"){
			var index = this.parent.allMyChildren.findIndex(x => x.id == this.id)
		}
		if (backColour < 40) backColour = 40
		var newText = "<div class='Setup' style='background-color:rgb("+backColour+", "+backColour+", "+backColour+")' id='" + this.id + "'>"
		newText += '<div class="dropdown"><button class="dropbtn">⇓</button><div class="dropdown-content">'
		newText += '<a class="btnDelete" href="#">Delete</a>'		
		newText += '</div></div>'
		newText += " " +this.type + "&nbsp;&nbsp;" + "| "+ this.id + "</div>"
		TC.outputToDiv(Parent, newText)
		if(this.hasOwnProperty("allMyChildren")){
			for (var baby of this.allMyChildren){
				baby.toHTML(this.id)
			}
		}
	}
	
	toString (tabNum) {
        let tab = "    "
		var theTab, child
		theTab = tabNum

        let resultStr = tab.repeat(tabNum) + this.type + "(function() {\r\n"
        for (child of this.allMyChildren) {
            resultStr += child.toString(theTab) + "\r\n"
        }
        resultStr += tab.repeat(theTab - 1) + "})\r\n"
        return resultStr
    }
}

class BeforeEach extends Setup{
	constructor (newParent) {
		super(newParent)
		this.type = "BeforeEach"
	}
    
    addMiscCode (itStr, newParent) {
        let aMisc = new MiscCode(itStr, newParent)
        this.allMyChildren.push(aMisc)
    }
}

class AfterEach extends Setup{
	constructor (newParent) {
		super(newParent)
		this.type = "AfterEach"
	}
}