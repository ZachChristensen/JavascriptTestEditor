//MODEL

class Model{
	constructor(newController){
		console.log("model")
		this.myController = newController
		this.myFiler = new Filer()

		//danger code!
		this.root = undefined

		this.currentSuite = this.root
		//Attempt loading, if nothing then create new?

		this.currentSpecName = ""
		this.asserts = []

		this.creatingSpec = false
		this.creatingBefore = false
		this.creatingAfter = false
		this.miscCode = []
	}

	createNewRoot(descriptionStr){
		this.root = new Suite(descriptionStr)
		this.currentSuite = this.root
	}

	setCurrentSuite (suite) {
		this.currentSuite = suite
	}

	getCurrentSuite () {
		return this.currentSuite
	}

	addSuite (descriptionStr) {
		var aSuite, parent
		parent = this.getCurrentSuite()
		aSuite = new Suite(descriptionStr, parent)
		parent.allMyChildren.push(aSuite)
		this.setCurrentSuite(aSuite)
		return aSuite
	}

	addSpec (descriptionStr, asserts) {
		var parentSuite = this.getCurrentSuite()
		parentSuite.addSpec(descriptionStr, parentSuite, asserts)
	}

	createAssert (type, contents) {
		return new Assert(type, contents)
	}

	createBeforeEach(){
		var parentSuite = this.getCurrentSuite()
		parentSuite.addSetup("beforeEach", this.miscCode)
		this.miscCode = []
	}

	createAfterEach(){
		var parentSuite = this.getCurrentSuite()
		parentSuite.addSetup("afterEach", this.miscCode)
		this.miscCode = []
	}

	createTestItems(splitFileArray){
		let pattern = /(\}\))/i
		for (let item of splitFileArray){
			if (pattern.test(item)){
				let splitLine = item.split("})")
				this.createNode(splitLine[0])
				this.createNode(splitLine[1])
			}else{
				this.createNode(item)
			}
		}
		if(this.root == undefined){
			return "Could not find a root suite"
		}else{
			return ""
		}
	}

	createRootSuite(item){
		if(this.getNodeDescription(item) != null){
			if (/[\w]+/i.exec(item) != null && /[\w]+/i.exec(item)[0].toLowerCase() == "describe"){
				this.createNewRoot(this.getNodeDescription(item))
			}
		}
	}

	createNode(item){
		if(this.root == undefined){
			this.createRootSuite(item, this)
		}else if (/[\w]+/i.exec(item) != null){
			let type = /[\w]+/i.exec(item)[0].toLowerCase()
			if (type == "describe"){
				this.checkCreatingStatuses()
				let suite = this.addSuite(this.getNodeDescription(item))
				this.setCurrentSuite(suite)
			}else if (type == "it"){
				this.checkCreatingStatuses()
				this.currentSpecName = this.getNodeDescription(item)
				this.creatingSpec = true
			}else if (type == "beforeeach"){
				this.checkCreatingStatuses()
				this.creatingBefore = true
			}else if (type == "aftereach"){
				this.checkCreatingStatuses()
				this.creatingAfter = true
			}else if (type == "expect"){
				let items = item.split("\n")
				for (let i = 0; i < items.length; i++){
					if(/[\w]+/i.exec(items[i]) == "expect"){
						this.asserts.push(this.createAssert(/[\w]+/i.exec(items[i])[0], items[i].trim()))
					}
				}
			}else{
				let items = item.split("\n")
				for (let i = 0; i < items.length; i++){
					if(items[i].trim() != ""){
						this.miscCode.push(items[i].trim())
					}
				}
			}
		}
		return false
	}

	checkCreatingStatuses(type){
		if(this.creatingBefore){
			this.createBeforeEach()
			this.creatingBefore = false
		}else if(this.creatingAfter){
			this.createAfterEach()
			this.creatingAfter = false
		}else if(this.creatingSpec){
			this.addSpec(this.currentSpecName, this.asserts)
			this.creatingSpec = false
			this.asserts = []
		}
	}

	getNodeDescription(node){
		if(/"[\s\S]+"/i.exec(node) != null){
			let description = /"[\s\S]+"/i.exec(node)[0]
			return description.replace(/\"/g, "")
		}else{
			return null
		}
	}

	find (idStr) {
		if (this.root.id === idStr){
			return this.root
		}
		return this.root.findChild(idStr)
	}

	updateItem(elementID, newStr){
		this.find(elementID).description = newStr
		console.log(this.find(elementID))
	}

	toString() {
		return this.root.toString(0)
	}

	toHTML() {
		var HTMLdiv = document.getElementById('main')
		HTMLdiv.innerHTML = ""
		if (this.root !== undefined){
			return this.root.toHTML('main')
		}else{
			document.getElementById('newRootBtn').style.display = "block"
		}
	}

}
