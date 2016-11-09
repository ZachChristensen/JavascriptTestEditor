/*
jshint esversion:6, jshint asi:true
*/
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
		let prevChild
    for (child of this.allMyChildren) {
				if(child.type == "Misc" && prevChild == "Assert"){
					resultStr += "\r\n"
				}
				console.log(resultStr)
				console.log(prevChild)
        resultStr +=  child.toString(theTab)  + "\r\n"
				prevChild = child.type
    }
    resultStr += tab.repeat(theTab - 1) + "});\r\n"
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
