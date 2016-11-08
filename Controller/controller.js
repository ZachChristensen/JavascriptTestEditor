/*
jshint esversion:6, jshint asi:true
*/
//Controller

class Controller{
	constructor(){
		this.myModel = new Model(this)
		this.myView = new HTMLView(this)
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
		let divs = document.getElementsByClassName('TestItem')
		for (let i of divs){
			i.addEventListener("mouseenter", function( event ) {
				console.log("WOrking!")
				console.log(this)
				if (theController.myView.hoveredItem !== undefined){
					theController.myView.resetItemBackground(theController.myView.hoveredItem.id)
				}
				theController.myView.setItemBackgroundHover(theController.myView.hoveredItem.id)
				theController.myView.hoveredItem = event.target
			})
			i.addEventListener("mouseleave", function( event ) {
				console.log("WOrking!")
				console.log(this)
				if (theController.myView.hoveredItem !== undefined){
					theController.myView.resetItemBackground(theController.myView.hoveredItem.id)
				}
				theController.myView.setItemBackgroundHover(event.target.parentElement.id)
				theController.myView.hoveredItem = event.target.parentElement
			})
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
