/*
jshint esversion:6, jshint asi:true
*/
//Controller

class Controller{
	constructor(testing = false){
		this.myModel = new Model(this)
		if (!testing){
			this.myView = new HTMLView(this)
		}
		console.log("controller")
	}

	updateDisplay(){
		this.myModel.toHTML()

		let filename = document.getElementById("filename")
		filename.innerHTML = this.myModel.filename

		theController.myModel.selected = []
		this.setButtonOnlicks()
		this.disableDragOnButtons()
	}

	disableDragOnButtons(){
		for (let button of document.getElementsByTagName('Button')){
			button.setAttribute('draggable', false)
			button.setAttribute('onmousedown', 'theController.myView.changeDrag(false, true)')
			button.setAttribute('onmouseup', 'theController.myView.changeDrag(true, false)')
			button.setAttribute('onmouseleave','theController.myView.changeDrag(true)')
		}
		for (let button of document.getElementsByTagName('a')){
			button.setAttribute('draggable', false)
			button.setAttribute('onmousedown', 'theController.myView.changeDrag(false, true)')
			button.setAttribute('onmouseup', 'theController.myView.changeDrag(true, false)')
			button.setAttribute('onmouseleave','theController.myView.changeDrag(true)')
		}
	}

	setButtonOnlicks(){
		//set onclick methods for dropdown addSpec/Suite btns
		let specbtns = document.getElementsByClassName("btnAddSpec")
		for (var spec of specbtns){
			spec.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.addSpecToThis()
			}
		}

		let suitebtns = document.getElementsByClassName("btnAddSuite")
		for (var suite of suitebtns){
			suite.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.addSuiteToThis()
			}
		}

		let deletebtns = document.getElementsByClassName("btnDelete")
		for (var btn of deletebtns){
			btn.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.deleteThis()
			}
		}

		let clonebtns = document.getElementsByClassName("btnClone")
		for (var btn of clonebtns){
			btn.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.cloneThis()
			}
		}

		let copybtns = document.getElementsByClassName("btnCopy")
		for (var btn of copybtns){
			btn.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.copyThis()
			}
		}

		let cutbtns = document.getElementsByClassName("btnCut")
		for (var btn of cutbtns){
			btn.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.cutThis()
			}
		}

		let pastebtns = document.getElementsByClassName("btnPaste")
		for (var btn of pastebtns){
			btn.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.pasteThis()
			}
		}

		let assertbtns = document.getElementsByClassName("btnAddAssert")
		for (var spec of assertbtns){
			spec.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.addAssertToThis()
			}
		}

		let miscbtns = document.getElementsByClassName("btnAddMisc")
		for (var misc of miscbtns){
			misc.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.addMiscToThis()
			}
		}

		let beforeBtn = document.getElementsByClassName("btnAddBeforeEach")
		for (var btn of beforeBtn){
			btn.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.addBeforeToThis()
			}
		}

		let afterBtn = document.getElementsByClassName("btnAddAfterEach")
		for (var btn of afterBtn){
			btn.onclick = function(event) {
				theController.myView.contextTarget = theController.myModel.find(event.target.parentElement.parentElement.parentElement.id)
				set_context.addAfterToThis()
			}
		}

		theController.myView.inputs = Array.prototype.slice.call(document.getElementsByClassName("input"))
		for (var assert of this.myModel.asserts){
			assert.setCurrentDropdown()
		}
	}

	outputToDiv(divID, content){
		this.myView.appendToDiv(divID, content)
		document.getElementById(divID).addEventListener('dragstart', function(event) {
			event.stopPropagation()
		})
	}

	updateTestItem(targetID, newChildID, newPosition = undefined){
		this.myModel.moveItem(targetID, newChildID, newPosition)
		this.updateDisplay()
	}

	loadTestData(){
		this.myModel.createNewRoot("VERY interesting test suite")
		this.myModel.addSpec("Cook is wearing apron")
		this.myModel.addAssert("cook.apron", false, 'toBeDefined', '')
		var suite = this.myModel.addSuite("Making Pancakes!")
		this.myModel.addBeforeEach()
		this.myModel.addMiscCode("var ingredients = [flour, eggs, milk, butter, banana]")
		this.myModel.addAfterEach()
		this.myModel.addMiscCode("plate.clean()")
		this.myModel.addSpec("Pancakes should be delish")
		this.myModel.addMiscCode("var bananana = 4\nbanana.slice()")
		this.myModel.addAssert("pancakes.eat()", false, 'toEqual', '"deeelish"')

	}

	saveToFile(fileName){
		this.myModel.myFiler.saveToFile(this.myModel, fileName)
	}

	loadFromFile(){
		let that = this
		this.myModel.myFiler.loadSuiteFromFile("fileSelector", this.myModel, function(splitFileArray) {
			that.myModel.myFiler.createTestItems(splitFileArray, that.myModel)
			that.updateDisplay()
			document.getElementById('newRootBtn').style.display = "none"
		})
	}
}
