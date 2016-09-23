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
  	
  	createSuite(suiteArray){
  		//takes a suite string that has been split on the { char
    		let pattern = /(\}\))/i;
    		let atRoot = true;
    		for (let item of suiteArray){
      			if (pattern.test(item)){
        			let splitLine = item.split("})");
        			this.createType(splitLine[0]);
        			this.createType(splitLine[1]);
      			}else if (atRoot){
        			this.testFrameWork.root._description = this.getName(item);
        			atRoot = false;
      			}else{
        			this.createType(item);
      			}
    		}
  	}
}
