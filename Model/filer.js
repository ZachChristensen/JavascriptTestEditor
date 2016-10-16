class Filer{
  constructor () {
      this.currentTestItem = undefined
      this.myModel = undefined
      this.miscCode = ""
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
      this.setPreviousTestItemMiscCode()
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
      let items = item.split("\n")
      for (let i = 0; i < items.length; i++){
          if(this.myModel.root == undefined){
              this.createRootSuite(items[i], this)
          }else if (/[\w]+/i.exec(items[i]) != null){
              let type = /[\w]+/i.exec(items[i])[0].toLowerCase()
              if (type == "describe"){
                  this.setPreviousTestItemMiscCode()
                  let suite = this.myModel.addSuite(this.getNodeDescription(items[i]), false)
                  this.myModel.setCurrentSuite(suite)
              }else if (type == "xdescribe"){
                  this.setPreviousTestItemMiscCode()
                  let suite = this.myModel.addSuite(this.getNodeDescription(items[i]), true)
                  this.myModel.setCurrentSuite(suite)
              }else if (type == "it"){
                  this.setPreviousTestItemMiscCode()
                  this.myModel.addSpec(this.getNodeDescription(items[i]))
              }else if (type == "beforeeach"){
                  this.setPreviousTestItemMiscCode()
                  this.myModel.addBeforeEach()
              }else if (type == "aftereach"){
                  this.setPreviousTestItemMiscCode()
                  this.myModel.addAfterEach()
              }else{
                  this.checkForMiscCode(items[i])
              }
          }
      }
  }
  setPreviousTestItemMiscCode(){
    if (this.miscCode != ""){
        this.myModel.addMiscCode(this.miscCode)
        this.miscCode = ""
    }
  }

  checkForMiscCode(line){
      let items = line.split("\n")
      let functionIdentifier = /(function\(\))/
      for (let i = 0; i < items.length; i++){
          if(/[\w]+/i.exec(items[i]) == "expect" || /[\w]+/i.exec(items[i]) == "should"){
              if (this.miscCode != ""){
                  this.myModel.addMiscCode(this.miscCode)
                  this.miscCode = ""
              }
              this.myModel.addAssert(items[i].trim())
          }else if (items[i].trim() != ""){
              this.miscCode += items[i].trim() + "\r\n"
          }
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
