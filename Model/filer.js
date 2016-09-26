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
      that.createSuite(that.splitString(e.target.result, "{"), currentFrameWork)
      callback()
    })
  }

  createSuite(suiteArray, currentFrameWork){
    let pattern = /(\}\))/i
    let atRoot = true
    console.log(currentFrameWork.root)
    for (let item of suiteArray){
      if (pattern.test(item)){
        let splitLine = item.split("})")
        this.createNode(splitLine[0], currentFrameWork)
        this.createNode(splitLine[1], currentFrameWork)
      }else if (atRoot){
        currentFrameWork.root._description = this.getNodeDescription(item)
        atRoot = false
      }else{
        this.createNode(item, currentFrameWork)
      }
    }
  }
}