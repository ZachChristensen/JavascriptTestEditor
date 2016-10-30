class Spec extends TestItem {
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Spec", newParent)
		this.allMyChildren = []
	}

	addAssert (contents, not, matcher, contents2) {
		let aAssert = new Assert(contents, contents2, this, not, matcher)
		this.allMyChildren.push(aAssert)
		return aAssert
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
