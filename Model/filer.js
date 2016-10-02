class Filer{
  constructor () {
    this.currentSpec = ""
    this.asserts = []
	}


  readFile(file, callback){
    let suiteArray = []
    let result
    let that = this
    var reader = new FileReader()
    reader.onload = callback
    reader.readAsText(file)
  }

  splitString(string, param){
    return string.split(param)
  }

  loadSuiteFromFile(inputElementId, currentFrameWork, callback){
    let file = document.getElementById(inputElementId).files[0]
    let that = this
    this.readFile(file, function(e) {
      let error = that.createSuite(that.splitString(e.target.result, "{"), currentFrameWork)
      console.log(error)
      callback(error)
    })
  }

  saveSuiteToFile(currentFrameWork, filename){
    let blob = new Blob([currentFrameWork.toString()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename + ".txt");
  }

  createSuite(suiteArray, currentFrameWork){
    let pattern = /(\}\))/i
    let atRoot = true
    for (let item of suiteArray){
          //console.log(item)
      if (pattern.test(item)){
        let splitLine = item.split("})")
        atRoot = this.createNode(splitLine[0], currentFrameWork, atRoot)
        atRoot = this.createNode(splitLine[1], currentFrameWork, atRoot)
      }else{
        atRoot = this.createNode(item, currentFrameWork, atRoot)
      }
    }
    if(atRoot){
      return "Could not find a root suite"
    }else{
      if(this.currentSpec != ""){
        currentFrameWork.addSpec(this.currentSpec, this.asserts)
      }
      return ""
    }
  }

  createRootSuite(item, currentFrameWork){
    if(this.getNodeDescription(item) != null){
      if (/[\w]+/i.exec(item) != null && /[\w]+/i.exec(item)[0].toLowerCase() == "describe"){
        currentFrameWork.createNewRoot(this.getNodeDescription(item))
        return true
      }
    }
    return false
  }

  createNode(item, currentFrameWork, atRoot){
    if(atRoot){
      return !this.createRootSuite(item, currentFrameWork)
    }else if (/[\w]+/i.exec(item) != null){
      let type = /[\w]+/i.exec(item)[0].toLowerCase()
      if (type == "describe"){
        if (this.currentSpec != ""){
          currentFrameWork.addSpec(this.currentSpec, this.asserts)
          this.asserts = []
          this.currentSpec = ""
        }
        let suite = currentFrameWork.addSuite(this.getNodeDescription(item))
        currentFrameWork.setCurrentSuite(suite)
      }else if (type == "it"){
        if (this.currentSpec == ""){
          this.currentSpec = this.getNodeDescription(item)
        }else{
          currentFrameWork.addSpec(this.currentSpec, this.asserts)
          this.asserts = []
          this.currentSpec = this.getNodeDescription(item)
        }
      }else if (type == "beforeAll"){
        //to be added
      }else if (type == "afterAll"){
        //to be added
      }else if (type == "expect"){
        let items = item.split("\n")
        for (let i = 0; i < items.length; i++){
          if(/[\w]+/i.exec(items[i]) != null){
            this.asserts.push(items[i].trim())
          }
        }
      }else{

      }
    }
    return false
  }

  getNodeDescription(node){
    if(/"[\s\S]+"/i.exec(node) != null){
      let description = /"[\s\S]+"/i.exec(node)[0]
      return description.replace(/\"/g, "")
    }else{
      return null
    }
  }
}
