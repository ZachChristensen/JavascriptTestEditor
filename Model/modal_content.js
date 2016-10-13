class modal_content{	
	static setAddSpec(){
		var title = "Add New Spec"
		var content = '<div id="modalContent"><input type="text" id="modalDescription" placeholder="Suite Description"></input><button id="modalAddBtn">Add</button></div>'
		var titleID = "modalTitle"
		var contentID = "modalContent"
		var titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		var contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		var modalAddBtn = document.getElementById("modalAddBtn")
		var modalDescr = document.getElementById("modalDescription")
		modalAddBtn.onclick = function(event) {
			theController.myModel.addSpec(modalDescr.value)
			theController.updateDisplay()
			modal.style.display = "none"
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
	
	static setAddSuite(){
		var title = "Add New Suite"
		var content = '<div id="modalContent"><input type="text" id="modalDescription" placeholder="Suite Description"></input><button id="modalAddBtn">Add</button></div>'
		var titleID = "modalTitle"
		var contentID = "modalContent"
		var titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		var contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		var modalAddBtn = document.getElementById("modalAddBtn")
		modalAddBtn.onclick = function(event) {
			var modalDescr = document.getElementById("modalDescription")
			theController.myModel.addSuite(modalDescr.value)
			theController.updateDisplay()
			modal.style.display = "none"
			modalDescr.value = ""
		}
		document.getElementById("modalDescription").addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode == 13) {
				modalAddBtn.click()
			}
		})
	}
	
	static setAddAssert(){
		var title = "Add New Assert"
		var content = '<div id="modalContent"><input type="text" id="modalDescription" placeholder="Assert Content"></input><button id="modalAddBtn">Add</button></div>'
		var titleID = "modalTitle"
		var contentID = "modalContent"
		var titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		var contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		var modalAddBtn = document.getElementById("modalAddBtn")
		modalAddBtn.onclick = function(event) {
			var modalDescr = document.getElementById("modalDescription")
			theController.myModel.addAssert(modalDescr.value)
			theController.updateDisplay()
			modal.style.display = "none"
			modalDescr.value = ""
		}
		document.getElementById("modalDescription").addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode == 13) {
				modalAddBtn.click()
			}
		})
	}
	
	static setNewRootSuite(){
		var title = "Add New Root Suite"
		var content = '<div id="modalContent"><input type="text" id="modalDescription" placeholder="Suite Description"></input><button id="modalAddBtn">Add</button></div>'
		var titleID = "modalTitle"
		var contentID = "modalContent"
		var titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		var contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		var modalAddBtn = document.getElementById("modalAddBtn")
		modalAddBtn.onclick = function(event) {
			document.getElementById('newRootBtn').style.display = "none"
			let modalDescr = document.getElementById("modalDescription")
			console.log(modalDescr.value)
			theController.myModel.createNewRoot(modalDescr.value)
			theController.updateDisplay()
			modal.style.display = "none"
			modalDescr.value = ""
			
		}
		document.getElementById("modalDescription").addEventListener("keyup", function(event) {
			event.preventDefault();
			if (event.keyCode == 13) {
				modalAddBtn.click()
			}
		})
	}
	
	static setSave(){
		var title = "Save File"
		var content = `<h4 style="margin-top:1em;">Save Options</h4>
		<form>
		  <h5>Assertion type:(coming soon)</h5>
		  <input type="radio" name="assert" value="assert" checked> assert<br>
		  <input type="radio" name="assert" value="expect"> expect<br>
		  <input type="radio" name="assert" value="should"> should  
		</form> 
		<h5 style="margin-top:1em;">Filename</h5>
		<input  value="TestCase" id='filenameInput'/>.txt<br>
		<button style="margin-top:1em;" id="modalSaveButton">Save File</button>
		`
		var titleID = "modalTitle"
		var contentID = "modalContent"
		var titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		var contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		
		var modalSaveButton = document.getElementById("modalSaveButton")
		modalSaveButton.onclick = function(event) {
			var filename = document.getElementById("filenameInput").value
			if (filename == "") return //Error popup ToDo - Zach
			theController.saveToFile(filename)
		}
	}
}