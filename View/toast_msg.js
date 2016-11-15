/*
jshint esversion:6, asi:true
*/
/*globals theController*/
function HideErrorMsg2() {
    setTimeout(function(){
        theController.myView.errorElements[theController.myView.errorElementIndex].style.opacity = 0
        setTimeout(function(){
            theController.myView.errorElements[theController.myView.errorElementIndex].style.display = 'none'
        }, 400);
    }, 2000);
}

class toast_msg{
	static showCopy(){
		toast_msg.show("Copied")
	}

	static showCut(){
		toast_msg.show("Cut")
	}

	static showClone(){
		toast_msg.show("Clone")
	}

	static showPaste(){
		toast_msg.show("Paste")
	}

	static showDeleted(){
		toast_msg.show("Deleted")
	}

	static showNoneSelected(){
		toast_msg.show("No selected items")
	}

	static show(msg){
		var contentElement = theController.myView.errorElements[theController.myView.errorElementIndex]
		contentElement.style.opacity = 0
        contentElement.style.display = 'block'
		contentElement.innerHTML = msg
		contentElement.style.opacity = 1
		HideErrorMsg2()
	}
}
