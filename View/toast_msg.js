/*
jshint esversion:6, asi:true
*/
/*globals theController*/
function HideErrorMsg2() {
    setTimeout(function(){
        theController.myView.errorElements[theController.myView.errorElementIndex].style.opacity = 0
        setTimeout(function(){
            theController.myView.errorElements[theController.myView.errorElementIndex].style.display = 'none'
        }, 400)
    }, 2000)
}

/**
* toast_msg
*
* @class toast_msg
*/
class toast_msg{
  /**
  * Toasts copied
  *
  * @method showCopy
  */
	static showCopy(){
		toast_msg.show("Copied")
	}

  /**
  * Toasts cut
  *
  * @method showCut
  */
	static showCut(){
		toast_msg.show("Cut")
	}

  /**
  * Toasts clone
  *
  * @method showClone
  */
	static showClone(){
		toast_msg.show("Clone")
	}

  /**
  * Toasts paste
  *
  * @method showPaste
  */
	static showPaste(){
		toast_msg.show("Paste")
	}

  /**
  * Toasts deleted
  *
  * @method showDeleted
  */
	static showDeleted(){
		toast_msg.show("Deleted")
	}

  /**
  * Toasts No selected items
  *
  * @method showNoneSelected
  */
	static showNoneSelected(){
		toast_msg.show("No selected items")
	}

  /**
  * Toasts content
  *
  * @method show
  * @param {string} msg
  */
	static show(msg){
		var contentElement = theController.myView.errorElements[theController.myView.errorElementIndex]
		contentElement.style.opacity = 0
        contentElement.style.display = 'block'
		contentElement.innerHTML = msg
		contentElement.style.opacity = 1
		HideErrorMsg2()
	}
}
