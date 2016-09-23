//Controller

console.log("HELLO")

class Controller{
	constructor(){
		this.myModel = new Model()
		this.myView = new View()
		console.log("controller")
	}
	
	loadSuiteFromFile(callback, inputElementId){
		//takes a callback function to be executed after the suite has been loaded
		//inputElementId expects a string
    		let file = document.getElementById(inputElementId).files[0];
    		let that = this;
    		this.myModel.filer.loadSuiteFromFile(file, function(e) {
      			that.createSuite(that.myModel.filer.splitString(e.target.result, "{"));
      			callback();
    		})
  	}	
}
