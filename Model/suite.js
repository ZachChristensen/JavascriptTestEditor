/*
jshint esversion:6, jshint asi:true
*/
class Suite extends TestItem{
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Suite", newParent)
		this.allMyChildren = []
	}

	addBefore () {
		let aBefore = new BeforeEach(this)
		this.allMyChildren.unshift(aBefore)
		return aBefore
	}

	addBeforeToEnd () {
		let aBefore = new BeforeEach(this)
		this.allMyChildren.push(aBefore)
		return aBefore
	}

	addAfter () {
		let aAfter = new AfterEach(this)
		this.allMyChildren.unshift(aAfter)
		return aAfter
	}

	addAfterToEnd () {
		let aAfter = new AfterEach(this)
		this.allMyChildren.push(aAfter)
		return aAfter
	}

	addSpec (itStr, newParent) {
		let aSpec = new Spec(itStr, newParent)
		this.allMyChildren.push(aSpec)
		return aSpec
	}

	addSuite (itStr, newParent) {
		let aSuite = new Suite(itStr, newParent)
		this.allMyChildren.push(aSuite)
		return aSuite
	}

	toString (tabNum) {
		var resultStr, theTab, child
		var tab = "    "
		theTab = tabNum
		resultStr = tab.repeat(theTab) + "describe(\"" + this.description + "\", function() {\r\n"
		theTab = theTab + 1

		for (child of this.allMyChildren) {
			resultStr +=  child.toString(theTab) + "\n"
		}
		resultStr += tab.repeat(theTab - 1) + "});\r\n"
		return resultStr
	}

	findChild (theId){
		for (var child of this.allMyChildren){
			if (child.id === theId){
				return child
			}
			if(child.hasOwnProperty('allMyChildren')){
				let result = child.findChild(theId)

				if(result !== undefined){
					return result
				}
			}
		}
	}
}
