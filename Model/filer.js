class Filer{
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
    }else if (/[\w]+/i.exec(item) != null && this.getNodeDescription(item) != null){
      let type = /[\w]+/i.exec(item)[0].toLowerCase()
      if (type == "describe"){
        let suite = currentFrameWork.addSuite(this.getNodeDescription(item))
        currentFrameWork.setCurrentSuite(suite)
      }else if (type == "it"){
        console.log(this.getNodeDescription(item))
        currentFrameWork.addSpec(this.getNodeDescription(item))
      }else if (type == "before"){
        //to be added
      }else if (type == "after"){
        //to be added
      }else{
        //to be added
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
