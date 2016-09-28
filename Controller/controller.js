//Controller

class Controller{
	constructor(){
		this.myModel = new Model(this)
		this.myView = new HTMLView(this)
		console.log("controller")
	}
	
	updateDisplay(){
		this.myModel.toHTML()
	}
	
	outputToDiv(divID, textContent){
		this.myView(divID, textContent)
	}
	
	loadTestData(){
		this.myModel.createNewRoot("Root Sweetie")
		this.myModel.addSpec("first Child spec")
		var suite = this.myModel.addSuite("firstChild Suite")
		this.myModel.setCurrentSuite(suite)
		this.myModel.addSpec("child of  child spec 1")
		this.myModel.addSpec("child of  child spec 2")
		this.myModel.addSuite("childOfChild Suite")
		this.myModel.setCurrentSuite(suite)
		this.myModel.addSpec("child of  child spec 3")
	}
	 
	loadFromFile(){
		let that = this
		this.myModel.myFiler.loadSuiteFromFile("fileInput", this.testFrameWork, function(e) {
			that.updateDisplay();
		})
  	}
	 
	saveViewToModel(){
    	this.myModel.myFiler.createSuite(this.myModel.myFiler.splitString(this.myView.getDisplayedSuite(document.getElementById("1")), "{"));
  	}
}

window.addEventListener('input', function (e) {
	if (e.target.id.substr(0, 4) === "Item"){
		let id = e.target.id.slice(0, -1)
		TC.myModel.updateItem(id, e.target.value)
	}
 }, false);
