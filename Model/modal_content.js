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
		var content = '<div id="modalContent"><input type="text" id="modalDescription" placeholder="Assert Content"></input><input type="text" id="modalDescription2" placeholder="Assert Content 2"></input><button id="modalAddBtn">Add</button></div>'
		var titleID = "modalTitle"
		var contentID = "modalContent"
		var titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		var contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
		var modalAddBtn = document.getElementById("modalAddBtn")
		modalAddBtn.onclick = function(event) {
			var modalDescr = document.getElementById("modalDescription")
			var modalDescr2 = document.getElementById("modalDescription2")

			theController.myModel.addAssert(modalDescr.value, true, 'toEqual', modalDescr2.value)
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
		var content = `<H3 style="margin-top:1em;">Save Options</H3>
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


	static setHelp(){
		var title = "Help"
		var content = `<H3 style="margin-top:1em;">Multiple Select</H3>
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
		var titleID = "modalTitle"
		var contentID = "modalContent"
		var titleElement = document.getElementById(titleID)
		titleElement.innerHTML = title
		var contentElement = document.getElementById(contentID)
		contentElement.innerHTML = content
	}
}
