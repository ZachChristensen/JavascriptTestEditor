//MODEL

class Model{
	constructor(newController){
		console.log("model")
		this.myController = newController
		this.myFiler = new Filer()

		//danger code!
		this.root = undefined
		this.copiedItem = undefined

		this.currentSuite = this.root
		//Attempt loading, if nothing then create new?

		this.currentSpec = undefined
		this.currentTestItem = undefined
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

	setCurrentTestItem (suite) {
		this.currentTestItem = suite
	}
	
	getCurrentTestItem () {
		return this.currentTestItem
	}

	setCopiedItem (suite) {
		this.copiedItem = suite
	}


	unsetCopiedItem (suite) {
		var item = this.copiedItem
		this.copiedItem = undefined
		return item
	}

	addSuite (descriptionStr) {
		var aSuite, parent
		parent = this.getCurrentSuite()
		aSuite = new Suite(descriptionStr, parent)
		parent.allMyChildren.push(aSuite)
		this.setCurrentSuite(aSuite)
		return aSuite
	}

	addSpec (descriptionStr) {
		var parentSuite = this.getCurrentSuite()
		this.currentTestItem = parentSuite.addSpec(descriptionStr, parentSuite)
	}

	addAssert (contents) {
		if(this.currentTestItem != undefined){
			this.currentTestItem.addAssert(contents, this.currentTestItem)
		}
	}

	addMiscCode (miscCode) {
		if(this.currentTestItem != undefined){
			this.currentTestItem.addMiscCode(miscCode, this.currentTestItem)
		}
	}

	createBeforeEach(){
		var parentSuite = this.getCurrentSuite()
		parentSuite.myBefore = new Setup()
		this.currentTestItem = parentSuite.myBefore
	}

	createAfterEach(){
		var parentSuite = this.getCurrentSuite()
		parentSuite.myAfter = new Setup()
		this.currentTestItem = parentSuite.myAfter
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
				let suite = this.addSuite(this.getNodeDescription(item))
				this.setCurrentSuite(suite)
			}else if (type == "it"){
				this.addSpec(this.getNodeDescription(item))
			}else if (type == "beforeeach"){
				this.createBeforeEach()
			}else if (type == "aftereach"){
				this.createAfterEach()
			}else if (type == "expect"){
				let items = item.split("\n")
				for (let i = 0; i < items.length; i++){
					if(/[\w]+/i.exec(items[i]) == "expect"){
						this.addAssert(/[\w]+/i.exec(items[i].trim()))
					}
				}
			}else{
				let items = item.split("\n")
				for (let i = 0; i < items.length; i++){
					if(items[i].trim() != ""){
						this.addMiscCode(items[i].trim())
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
		var item = this.find(elementID)
		if (item.type === "Assert" || item.type === "Misc"){
			item.contents = newStr
		}
		else item.description = newStr
		console.log(item)
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
