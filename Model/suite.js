class Suite extends TestItem{
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Suite", newParent)
		this.allMyChildren = []
	}

  addBefore () {
		let aBefore = new BeforeEach(this)
		this.allMyChildren.push(aBefore)
		return aBefore
	}

  addAfter () {
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
	}

  toString (tabNum) {
		var resultStr, theTab, child
		var tab = "    "
		theTab = tabNum
		resultStr = tab.repeat(theTab) + "describe(\"" + this.description + "\", function() {\r\n"
		theTab = theTab + 1

		for (child of this.allMyChildren) {
			resultStr +=  child.toString(theTab) + "\r\n"
		}
		resultStr += tab.repeat(theTab - 1) + "})\r\n"
		return resultStr
	}

	findChild (theId){
		for (var child of this.allMyChildren){
			if (child.id === theId){
				console.log(child.description + " found")
				return child
			}
			if(child.hasOwnProperty('myAfter')){
				if (child.myAfter !== undefined){
					if (child.myAfter.id === theId){
						return child.myAfter
					}
					let result = child.myAfter.findChild(theId)
					if(result !== undefined){
						return result
					}
				}
				if (child.myBefore !== undefined){
					if (child.myBefore.id === theId){
						return child.myBefore
					}
					let result = child.myBefore.findChild(theId)
					if(result !== undefined){
						return result
					}
				}
			}
			if(child.hasOwnProperty('allMyChildren')){
				let result = child.findChild(theId)

				if(result !== undefined){
					console.log(result.description + " found")
					return result
				}
			}
		}
	}
}
