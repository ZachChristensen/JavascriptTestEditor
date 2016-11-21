/*
jshint esversion:6, jshint asi:true
*/
/**
* modal_content
*
* @class modal_content
* @constructor
*/
class modal_content{
	/**
	* Sets modal to addspec
	*
	* @method setAddSpec
	*/
	static setAddSpec(){
		let title = "Add New Spec"
		let content = '<div id="modalContent"><input type="text" id="modalDescription" placeholder="Suite Description"></input><button id="modalAddBtn">Add</button></div>'
		let titleID = "modalTitle"
		let contentID = "modalContent"
		let titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		let contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		let modalAddBtn = document.getElementById("modalAddBtn")
		let modalDescr = document.getElementById("modalDescription")
		modalAddBtn.onclick = function(event) {
			theController.myModel.addSpec(modalDescr.value)
			theController.updateDisplay()
			theController.myView.modal.style.display = "none"
			modalDescr.value = ""
		}
		document.getElementById("modalDescription").addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode == 13) {
				modalAddBtn.click()
			}
		})
		modalDescr.focus()
	}

	/**
	* Sets modal to addSuite
	*
	* @method setAddSuite
	*/
	static setAddSuite(){
		let title = "Add New Suite"
		let content = '<div id="modalContent"><input type="text" id="modalDescription" placeholder="Suite Description"></input><button id="modalAddBtn">Add</button></div>'
		let titleID = "modalTitle"
		let contentID = "modalContent"
		let titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		let contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		let modalAddBtn = document.getElementById("modalAddBtn")
		modalAddBtn.onclick = function(event) {
			let modalDescr = document.getElementById("modalDescription")
			theController.myModel.addSuite(modalDescr.value)
			theController.updateDisplay()
			theController.myView.modal.style.display = "none"
			modalDescr.value = ""
		}
		document.getElementById("modalDescription").addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode == 13) {
				modalAddBtn.click()
			}
		})
	}

	/**
	* Sets modal to addAssert
	*
	* @method setAddAssert
	*/
	static setAddAssert(){
		let title = "Add New Assert"
		let content = `<div id="modalContent"><br>
		expect(<input type="text" id="modalDescription" placeholder="Assert Content"></input>)
		 <span>.</span>
		 <select id='modald1'>
			 <option disabled>Select...</option>
			 <option value='toBe'>toBe</option>
			 <option value='toEqual'>toEqual</option>
			 <option value='toMatch'>toMatch</option>
			 <option value='toBeDefined'>toBeDefined</option>
			 <option value='toBeUndefined'>toBeUndefined</option>
			 <option value='toBeNull'>toBeNull</option>
			 <option value='toBeTruthy'>toBeTruthy</option>
			 <option value='toBeFalsy'>toBeFalsy</option>
			 <option value='toContain'>toContain</option>
			 <option value='toBeLessThan'>toBeLessThan</option>
			 <option value='toBeGreaterThan'>toBeGreaterThan</option>
			 <option value='toBeCloseTo'>toBeCloseTo</option>
			 <option value='toThrow'>toThrow</option>
			 <option value='toThrowError'>toThrowError</option>
		 </select>
		 (<input type="text" id="modalDescription2" placeholder="Assert Content 2"></input>)
 		<button id="modalAddBtn">Add</button>
		</div>`
		let titleID = "modalTitle"
		let contentID = "modalContent"
		let titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		let contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		let modalAddBtn = document.getElementById("modalAddBtn")
		modalAddBtn.onclick = function(event) {
			let modalDescr = document.getElementById("modalDescription")
			let modalDescr2 = document.getElementById("modalDescription2")
			let modald1 = document.getElementById("modald1")

			theController.myModel.addAssert(modalDescr.value, false, modald1.value, modalDescr2.value)
			theController.updateDisplay()
			theController.myView.modal.style.display = "none"
			modalDescr.value = ""
		}
		document.getElementById("modalDescription").addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode == 13) {
				modalAddBtn.click()
			}
		})
	}

	/**
	* Sets modal to addNewRootSuite
	*
	* @method setNewRootSuite
	*/
	static setNewRootSuite(){
		let title = "Add New Root Suite"
		let content = '<div id="modalContent"><input type="text" id="modalDescription" placeholder="Suite Description"></input><button id="modalAddBtn">Add</button></div>'
		let titleID = "modalTitle"
		let contentID = "modalContent"
		let titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		let contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		let modalAddBtn = document.getElementById("modalAddBtn")
		modalAddBtn.onclick = function(event) {
			document.getElementById('newRootBtn').style.display = "none"
			let modalDescr = document.getElementById("modalDescription")
			console.log(modalDescr.value)
			theController.myModel.createNewRoot(modalDescr.value)
			theController.updateDisplay()
			theController.myView.modal.style.display = "none"
			modalDescr.value = ""

		}
		document.getElementById("modalDescription").addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode == 13) {
				modalAddBtn.click()
			}
		})
	}

	/**
	* Sets modal to save
	*
	* @method setSave
	*/
	static setSave(){
		let title = "Save File"
		let content = `<h5 style="margin-top:1em;">Filename</h5>
		<input  value="TestCase" id='filenameInput'/>.js<br>
		<button style="margin-top:1em;" id="modalSaveButton">Save File</button>
		`
		let titleID = "modalTitle"
		let contentID = "modalContent"
		let titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		let contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content

		let filenameInput = document.getElementById("filenameInput")

		filenameInput.value = theController.myModel.filename.split('.')[0]

		let modalSaveButton = document.getElementById("modalSaveButton")
		modalSaveButton.onclick = function(event) {
			let filename = document.getElementById("filenameInput").value
			if (filename == "") return toast_msg.show("Filename cannot be empty")
			theController.saveToFile(filename)
		}
	}

	/**
	* Sets modal to help
	*
	* @method setHelp
	*/
	static setHelp(){
		let title = "Help"
		let content = `<H3 style="margin-top:1em;">Multiple Select</H3>
		<p>You can select multple test items with the same parent at once by pressing the ctrl key before clicking them.<br>
		After doing this you can press ctrl + right click to show a menu that allows you to copy, clone, cut or delete them all at once.<br>
		</p><br>
		<h4 style="margin-top:1em;">Specifying Save Location</h4>
		<p>If you would like to specify the save location for your test file you have to change an option in your browser to let you do so:</p>
		<h4 style="margin-top:1em;">Firefox</h4>
		<p>In <span style="font-weight: bold;">Options</span> under <span style="font-weight: bold;">General</span> check the box titled "Always ask me where to save files"</p>
		<h4 style="margin-top:1em;">Chrome</h4>
		<p>In <span style="font-weight: bold;">Settings</span>
at the bottom, click <span style="font-weight: bold;">Show advanced settings</span>.<br>
In the <span style="font-weight: bold;">Downloads</span> section:<br>
Check the box next to "Ask where to save each file before downloading."<br>
</p>
		<br><br>Thank you for using this application if you find any issues feel free to submit it to our GitHub page at:<br>
		<a href="https://github.com/ZachChristensen/JavascriptTestEditor">https://github.com/ZachChristensen/JavascriptTestEditor</a>
		`
		let titleID = "modalTitle"
		let contentID = "modalContent"
		let titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		let contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
	}
}
