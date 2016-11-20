/*
jshint esversion:6, jshint asi:true
*/
class Filer{
  constructor (myModel) {
      this.currentTestItem = undefined
      this.myModel = myModel
      this.miscCode = ""
	}


  readFile(file, callback){
    let suiteArray = []
    let result
    let that = this
    let reader = new FileReader()
    reader.onload = callback
    reader.readAsText(file)
  }

  splitString(string, param){
    return string.split(param)
  }

  loadSuiteFromFile(inputElementId, currentFrameWork, callback){
    let file = document.getElementById(inputElementId).files[0]
    theController.myModel.filename = file.name
    let that = this
    this.readFile(file, function(e) {
      callback(that.splitString(e.target.result, "{"))
    })
  }

  saveToFile(currentFrameWork, filename){
    let blob = new Blob([currentFrameWork.toString()], {type: "text/javascript;charset=utf-8"})
    saveAs(blob, filename + ".js")
  }

  setCurrentTestItemToParent(){
    this.setPreviousTestItemMiscCode()
    if(this.myModel.currentTestItem != this.myModel.root) {
      this.myModel.currentTestItem = this.myModel.currentTestItem.parent
    }
  }

  createTestItems(splitFileArray, model){
      this.myModel = model
      let pattern = /(\}\))/i
      for (let item of splitFileArray){
          if (pattern.test(item)){
              let splitLine = item.split("})")
              for (let i = 0; i < splitLine.length; i++){
                if(/^\s*$/.test(splitLine[i])){
                  if(this.myModel.currentSuite != this.myModel.root) {
                    this.myModel.currentSuite = this.myModel.currentSuite.parent
                  }
                }else{
                  this.createTestItem(splitLine[i])
                  if(i < splitLine.length - 1) {
                    this.setCurrentTestItemToParent()
                  }
                }
              }
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
      item = item.replace(/;/g, "")
      let items = item.split("\n")
      for (let i = 0; i < items.length; i++){
          if(this.myModel.root == undefined){
              this.createRootSuite(items[i], this)
          }else if (/[\w]+/i.exec(items[i]) != null){
              let type = /[\w]+/i.exec(items[i])[0].toLowerCase()
              if (type == "describe"){
                  this.setPreviousTestItemMiscCode()
                  let suite = this.myModel.addSuite(this.getNodeDescription(items[i]), false)
                  this.myModel.currentSuite = suite
              }else if (type == "xdescribe"){
                  this.setPreviousTestItemMiscCode()
                  let suite = this.myModel.addSuite(this.getNodeDescription(items[i]), true)
                  this.myModel.currentSuite = suite
              }else if (type == "it"){
                  this.setPreviousTestItemMiscCode()
                  this.myModel.addSpec(this.getNodeDescription(items[i]))
              }else if (type == "beforeeach"){
                  this.setPreviousTestItemMiscCode()
                  this.myModel.addBeforeEachToEnd(true)
              }else if (type == "aftereach"){
                  this.setPreviousTestItemMiscCode()
                  this.myModel.addAfterEachToEnd(true)
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
              this.splitAssert(items[i].trim())
          }else if (items[i].trim() != ""){
              this.miscCode += items[i].trim() + "\r\n"
          }
      }
  }

  splitAssert(str){
      console.log("TRY ADD ASSERT")
      let arr = str.substring(str.indexOf('(')+1)
      let not = false
      let content = ""
      let matcher = "toEqual"
      let arr2 = arr.split("")
      let numBrack = 1
      let arr2Num = 0
      let cycleLimit = 50
      while (numBrack >= 1){
          if (cycleLimit-- === 0){
              //prevent inf loop
              console.log('inf loop prevented??')
              return
          }
          if (arr2[arr2Num] === "("){
              numBrack++
          }
          if (arr2[arr2Num] === ")"){
              numBrack--
          }
          arr2Num++
      }
      content = arr.substr(0, arr2Num-1)

      let matchStr = arr.substr(arr2Num)
      let cnt2 = arr.substr(arr2Num)
      cnt2 = cnt2.substring(cnt2.indexOf('('))
      matchStr = matchStr.substring(0, matchStr.indexOf('('))
      let matchers = matchStr.split('.')
      if (matchers[1] === 'not'){
          not = true
          matcher = matchers[2]
      }
      else{
          matcher = matchers[1]
      }
      cnt2 = cnt2.substr(1,cnt2.length-2)
      this.myModel.addAssert(content, not, matcher, cnt2)
  }

  getNodeDescription(node){
      if(/"[\s\S]+"/i.exec(node) != null){
          let description = /"[\s\S]+"/i.exec(node)[0]
          description = description.replace(/\'/g, "&#8217;")
          return description.replace(/\"/g, "")
      }else{
          return null
      }
  }
}
