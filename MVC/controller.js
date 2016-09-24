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
    		let file = document.getElementById(inputElementId).files[0]
    		let that = this
    		this.myModel.filer.loadSuiteFromFile(file, function(e) {
      			that.createSuite(that.myModel.filer.splitString(e.target.result, "{"))
      			callback()
    		})
  	}
  	
  	createSuite(suiteArray){
  		//takes a suite string that has been split on the { char
    		let pattern = /(\}\))/i
    		let atRoot = true
    		for (let item of suiteArray){
      			if (pattern.test(item)){
        			let splitLine = item.split("})")
        			this.addToCurrentSuite(splitLine[0])
        			this.addToCurrentSuite(splitLine[1])
      			}else if (atRoot){
        			this.myModel.myTestFrameWork.root._description = this.getName(item)
        			atRoot = false;
      			}else{
        			this.addToCurrentSuite(item)
      			}
    		}
  	}
  	
  	addToCurrentSuite(suiteNodeString){
    		suiteNodeString = suiteNodeString.trim()
    		//regex is finding all letters from the start of the string
    		let result = /^\w+/g.exec(suiteNodeString)
    		if (result == "describe"){
      			let child = this.myModel.myTestFrameWork.addSuite(this.getName(suiteNodeString))
      			this.myModel.myTestFrameWork.currentSuite = child
    		}else if (result == "it"){
      			this.myModel.myTestFrameWork.addSpec(this.getName(suiteNodeString))
    		}
  	}
  	
  	getName(suiteNodeString){
  		//regex is searching for any characters between " " chars
    		let name = /("[\s\S]+")/g.exec(suiteNodeString)
    		return name[0].replace("\"",'')
  	}
}
