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
      callback(that.splitString(e.target.result, "{"))
    })
  }

  saveToFile(currentFrameWork, filename){
    let blob = new Blob([currentFrameWork.toString()], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename + ".txt");
  }
}
