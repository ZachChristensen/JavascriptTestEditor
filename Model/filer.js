class Filer{
  constructor () {
      this.currentTestItem = undefined
      this.myModel = undefined
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
      callback(that.splitString(e.target.result, "{"))
    })
  }

  saveToFile(currentFrameWork, filename){
    let blob = new Blob([currentFrameWork.toString()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename + ".txt");
  }
  createTestItems(splitFileArray, model){
      this.myModel = model
      let pattern = /(\}\))/i
      for (let item of splitFileArray){
          if (pattern.test(item)){
              let splitLine = item.split("})")
              this.createTestItem(splitLine[0])
              this.createTestItem(splitLine[1])
          }else{
              this.createTestItem(item)
          }
      }
      if(this.myModel.root == undefined){
          return "Could not find a root suite"
      }else{
          return ""
      }
  }

  createRootSuite(item){
      if(this.getNodeDescription(item) != null){
          if (/[\w]+/i.exec(item) != null && /[\w]+/i.exec(item)[0].toLowerCase() == "describe"){
              this.myModel.createNewRoot(this.getNodeDescription(item))
          }
      }
  }

  createTestItem(item){
      if(this.myModel.root == undefined){
          this.createRootSuite(item, this)
      }else if (/[\w]+/i.exec(item) != null){
          let type = /[\w]+/i.exec(item)[0].toLowerCase()
          if (type == "describe"){
              let suite = this.myModel.addSuite(this.getNodeDescription(item), false)
              this.myModel.setCurrentSuite(suite)
          }else if (type == "xdescribe"){
              let suite = this.myModel.addSuite(this.getNodeDescription(item), true)
              this.myModel.setCurrentSuite(suite)
          }else if (type == "it"){
              this.myModel.addSpec(this.getNodeDescription(item))
          }else if (type == "beforeeach"){
              this.myModel.addBeforeEach()
          }else if (type == "aftereach"){
              this.myModel.addAfterEach()
          }else{
              this.checkForMiscCode(item)
          }
      }
  }

  checkForMiscCode(line){
      let items = line.split("\n")
      let miscCode = ""
      for (let i = 0; i < items.length; i++){
          if(/[\w]+/i.exec(items[i]) == "expect" || /[\w]+/i.exec(items[i]) == "should"){
              if (miscCode != ""){
                  this.myModel.addMiscCode(miscCode)
                  miscCode = ""
              }
              this.myModel.addAssert(items[i].trim())
          }else if (items[i].trim() != ""){
              miscCode += items[i].trim() + "\r\n"
          }
      }
      if (miscCode != ""){
          this.myModel.addMiscCode(miscCode)
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
}
