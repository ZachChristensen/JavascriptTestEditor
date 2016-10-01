//VIEW

class HTMLView{
	constructor(newController){
		console.log("view")
		this.controller = newController
	}

	cleanView(){
		//untested
		document.getElementById('main').innerHTML = ""
	}

	appendToDiv(divID, textContent){
		var HTMLdiv = document.getElementById(divID)
		HTMLdiv.innerHTML += textContent
	}
}
