class Spec extends TestItem {
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Spec", newParent)
		this.allMyChildren = []
	}

	addAssert (contents, newParent) {
		let aAssert = new Assert(contents, newParent)
		this.allMyChildren.push(aAssert)
	}

    toString (tabNum) {
        var resultStr, theTab, child
        var tab = "    "
        theTab = tabNum
        resultStr = tab.repeat(theTab) + "it(\"" + this.description + "\", function() {\r\n"
        theTab = theTab + 1
        for (child of this.allMyChildren) {
            resultStr +=  child.toString(theTab)  + "\r\n"
        }
        resultStr += tab.repeat(theTab - 1) + "})\r\n"
        return resultStr
    }
    addAssert (contents, newParent) {
        let aAssert = new Assert(contents, newParent)
        this.allMyChildren.push(aAssert)
    }

    addMiscCode (itStr, newParent) {
        let aMisc = new MiscCode(itStr, newParent)
        this.allMyChildren.push(aMisc)
    }

	findChild (theId){
		for (var child of this.allMyChildren){
			if (child.id === theId){
				return child
			}
			else{
				if(child.hasOwnProperty('allMyChildren')){
					let result = child.findChild(theId)
					if(result !== undefined){
						return result
					}
				}
			}
		}
	}
}
