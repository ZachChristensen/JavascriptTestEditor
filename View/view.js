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
	
	setItemClickListeners(elementID){
		var theElement = document.getElementById(elementID)
		theElement.addEventListener('click', function(e) {
			var ctxMenu = document.getElementById("ctxMenu");
			ctxMenu.style.display = "";
			ctxMenu.style.left = "";
			ctxMenu.style.top = "";

			if (e.ctrlKey) {
				
				theController.myModel.selectItem(theController.myModel.find(e.target.id))
				
			}
			e.stopPropagation()
		});
		
		theElement.addEventListener("contextmenu",function(event){
			if (event.ctrlKey) {
				event.preventDefault();
				var ctxMenu = document.getElementById("ctxMenu");
				ctxMenu.style.display = "block";
				ctxMenu.style.left = (event.pageX - 10)+"px";
				ctxMenu.style.top = (event.pageY - 10)+"px";
			}
		},false);
				
		//Incomplete highlight on hover
		// theElement.addEventListener("mouseover", function( event ) {
			// if (event.target.className === "dropbtn" || event.target.className.slice(0,3) === "btn") return false
			// document.getElementById(event.target.id).style.backColour = "#AAA";
			    // setTimeout(function() {
					// event.target.style.backColour = "";
				// }, 500);
		// }, false);
	}
	
	changeItemBackground(theElementId){
		document.getElementById(theElementId).style.backgroundColor = '#9DD'
	}
	
	resetItemBackground(theElementId){
		let backColour = 240 - (theController.myModel.find(theElementId).findIndent() * 20)
		document.getElementById(theElementId).style.backgroundColor = "rgb("+backColour+", "+backColour+", "+backColour+")"
	}

	appendToDiv(divID, textContent){
		var HTMLdiv = document.getElementById(divID)
		HTMLdiv.innerHTML += textContent
	}
	
	setToDiv(divID, textContent){
		var HTMLdiv = document.getElementById(divID)
		HTMLdiv.innerHTML = textContent
	}
}
