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
		modalAddBtn.onclick = function(event) {
			var modalDescr = document.getElementById("modalDescription")
			TC.myModel.addSpec(modalDescr.value)
			TC.updateDisplay()
			modal.style.display = "none"
			modalDescr.value = ""
		}

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
			TC.myModel.addSuite(modalDescr.value)
			TC.updateDisplay()
			modal.style.display = "none"
			modalDescr.value = ""
		}
	}
	
	static setNewRootSuite(){
		console.log("delet")
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
			TC.myModel.createNewRoot(modalDescr.value)
			TC.updateDisplay()
			modal.style.display = "none"
			modalDescr.value = ""
			//reset counter
		}
	}
}