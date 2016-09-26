class Filer{
  loadSuiteFromFile(file, callback){
    let suiteArray = []
    let result
    let that = this
    var reader = new FileReader()
    reader.onload = callback
    reader.readAsText(file)
	console.log("Filer")
  }

  splitString(string, param){
    return string.split(param)
  }
}
