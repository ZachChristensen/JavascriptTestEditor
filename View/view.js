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
	  
	getDisplayedSuite(element){
		let res = "";
		if (element.childElementCount > 1){
			for (let i = 0; i < element.childElementCount; i++) {
			//looping through each child element of root element
				if (element.children[i].childElementCount == 0) {
				//no more children
					let elementContents = this.getTxtAreaContents(element.children[i])
					if (elementContents != ""){
							res += elementContents;
					}
				}else if (element.children[i].childElementCount == 1){
				//one child
					res += this.getTxtAreaContents(element.children[i].children[0]);
				}else{
				//multiple children
					for (let c = 0; c < element.children[i].childElementCount; c++) {
							res += this.getDisplayedSuite(element.children[i].children[c]);
					}
				}
			}
		}else{
			res += this.getTxtAreaContents(element)
		}
		return res;
  	}

  	getTxtAreaContents(element){
		if (element.tagName == "TEXTAREA"){
			return element.value;
		}else{
			return "";
		}
  	}
}
