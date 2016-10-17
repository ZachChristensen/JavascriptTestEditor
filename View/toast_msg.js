function HideErrorMsg2() {
    setTimeout(function(){ document.getElementsByClassName("error")[0].style.opacity = 0}, 2000);
}

class toast_msg{	
	static showCopy(){
		toast_msg.show("Copied")
	}
	
	static showCut(){
		toast_msg.show("Cut")
	}
	
	static showClone(){
		toast_msg.show("Cut")
	}
	
	static showPaste(){
		toast_msg.show("Cut")
	}
	
	static showDeleted(){
		toast_msg.show("Deleted")
	}
	
	static show(msg){
		var contentClass = "error"
		var contentElement = document.getElementsByClassName(contentClass)[0]
		contentElement.style.opacity = 0;
		contentElement.innerHTML = msg
		contentElement.style.opacity = 1;
		HideErrorMsg2()
	}
}