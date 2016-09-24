class Filer{
  loadSuiteFromFile(file, callback){
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
}
