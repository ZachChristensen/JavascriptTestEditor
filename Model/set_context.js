/**
* A set_context
*
* @class set_context
*/
class set_context{
  /**
  * Sets context 1 suite
  *
  * @method setCtx1Suite
  * @param {int} id
  */
    static setCtx1Suite(id){
        var theItem = theController.myModel.find(id)
        document.getElementById(id).backgroundColor = "red"
        theController.myView.contextTarget = theItem
        var contextMenu = document.getElementsByClassName("ctx2-content")[0]
        contextMenu.innerHTML = ""

        var a = document.createElement("a")
        a.onclick = set_context.deleteThis
        var text = document.createTextNode("Delete")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.addSpecToThis
        var text = document.createTextNode("Add " + theController.myModel.currentLanguage.spec)
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.addSuiteToThis
        var text = document.createTextNode("Add " + theController.myModel.currentLanguage.suite)
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.addBeforeToThis
        var text = document.createTextNode("Add " + theController.myModel.currentLanguage.beforeEach)
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.addAfterToThis
        var text = document.createTextNode("Add " + theController.myModel.currentLanguage.afterEach)
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.addMiscToThis
        var text = document.createTextNode("Add Code")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)
        if (theItem !== theController.myModel.root) {
            var a = document.createElement("a")
            a.onclick = set_context.cloneThis
            var text = document.createTextNode("Clone")
            a.appendChild(text)
            a.className = "ctxItem"
            contextMenu.appendChild(a)
        }
        var a = document.createElement("a")
        a.onclick = set_context.copyThis
        var text = document.createTextNode("Copy")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)
        if (theItem !== theController.myModel.root) {
            var a = document.createElement("a")
            a.onclick = set_context.cutThis
            var text = document.createTextNode("Cut")
            a.appendChild(text)
            a.className = "ctxItem"
            contextMenu.appendChild(a)
        }
        var a = document.createElement("a")
        a.onclick = set_context.pasteThis
        var text = document.createTextNode("Paste")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

    }
    /**
    * Sets context 1 spec
    *
    * @method setCtx1Spec
    * @param {int} id
    */
    static setCtx1Spec(id){
        var theItem = theController.myModel.find(id)
        document.getElementById(id).backgroundColor = "red"
        theController.myView.contextTarget = theItem
        var contextMenu = document.getElementsByClassName("ctx2-content")[0]
        contextMenu.innerHTML = ""

        var a = document.createElement("a")
        a.onclick = set_context.deleteThis
        var text = document.createTextNode("Delete")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.addAssertToThis
        var text = document.createTextNode("Add "+ theController.myModel.currentLanguage.assert)
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.addMiscToThis
        var text = document.createTextNode("Add Code")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.cloneThis
        var text = document.createTextNode("Clone")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.copyThis
        var text = document.createTextNode("Copy")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.cutThis
        var text = document.createTextNode("Cut")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.pasteThis
        var text = document.createTextNode("Paste")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)
    }

    /**
    * Sets context 1 code
    *
    * @method setCtx1Spec
    * @param {int} id
    */
    static setCtx1Code(id){
        var theItem = theController.myModel.find(id)
        theController.myView.contextTarget = theItem
        var contextMenu = document.getElementsByClassName("ctx2-content")[0]
        contextMenu.innerHTML = ""
        var a = document.createElement("a")
        a.onclick = set_context.deleteThis
        var text = document.createTextNode("Delete")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.cloneThis
        var text = document.createTextNode("Clone")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.copyThis
        var text = document.createTextNode("Copy")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)
    }

    /**
    * Sets context 1 assert
    *
    * @method setCtx1Assert
    * @param {int} id
    */
    static setCtx1Assert(id){
        var theItem = theController.myModel.find(id)
        theController.myView.contextTarget = theItem
        var contextMenu = document.getElementsByClassName("ctx2-content")[0]
        contextMenu.innerHTML = ""
        var a = document.createElement("a")
        a.onclick = set_context.deleteThis
        var text = document.createTextNode("Delete")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.cloneThis
        var text = document.createTextNode("Clone")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.copyThis
        var text = document.createTextNode("Copy")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)
    }

    /**
    * Sets context 1 setup function
    *
    * @method setCtx1Setup
    * @param {int} id
    */
    static setCtx1Setup(id){
        theController.myView.contextTarget = theController.myModel.find(id)
        var contextMenu = document.getElementsByClassName("ctx2-content")[0]
        contextMenu.innerHTML = ""

        var a = document.createElement("a")
        a.onclick = set_context.deleteThis
        var text = document.createTextNode("Delete")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.addMiscToThis
        var text = document.createTextNode("Add Code")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.copyThis
        var text = document.createTextNode("Copy")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.cutThis
        var text = document.createTextNode("Cut")
        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        var a = document.createElement("a")
        a.onclick = set_context.pasteThis
        var text = document.createTextNode("Paste")
        a.className = "ctxItem"
        contextMenu.appendChild(a)

        a.appendChild(text)
        a.className = "ctxItem"
        contextMenu.appendChild(a)
    }

    //Button Fuctions
    /**
    * Toasts and sets copied item
    *
    * @method copyThis
    */
    static copyThis(){
        theController.myModel.copiedItem = theController.myView.contextTarget
        toast_msg.showCopy()
    }

    /**
    * Toasts and creates cloned item
    *
    * @method cloneThis
    */
    static cloneThis(){
        var currentItem = theController.myView.contextTarget
        let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
        currentItem.parent.cloneChild(index, true)
        toast_msg.showClone()
    }

    /**
    * Toasts and deletes cloned item
    *
    * @method deleteThis
    */
    static deleteThis(){
        if (theController.myView.contextTarget === undefined){
            return
        }
        let question = ""
        if (theController.myView.contextTarget.type === "Suite"){
            question = "Are you sure you want to delete this suite and all of its subitems?"
        }
        else if (theController.myView.contextTarget.type === "Spec"){
            question = "Are you sure you want to delete this spec and all of its subitems?"
        }
        else if (theController.myView.contextTarget.type === "Assert"){
            question = "Are you sure you want to delete this assert?"
        }
        else if (theController.myView.contextTarget.type === "Misc"){
            question = "Are you sure you want to delete this code?"
        }
        else if (theController.myView.contextTarget.type === "BeforeEach"){
            question = "Are you sure you want to delete this BeforeEach?"
        }
        else if (theController.myView.contextTarget.type === "AfterEach"){
            question = "Are you sure you want to delete this AfterEach?"
        }
        if (confirm(question)) {
            let item = theController.myView.contextTarget
            //If deleting root suite
            if (item === theController.myModel.root){
                theController.myModel.root = undefined
                theController.myModel.currentSuite = undefined
                theController.myModel.asserts = []
                idGenerator = new idCounter()
            }
            else{
                theController.myModel.currentSuite = item.parent
                let theParent = item.parent
                let index = theParent.allMyChildren.findIndex(x => x.id == item.id)
                theParent.removeChild(index)
            }
            if (item.type === "Assert"){
                let doesExist = theController.myModel.asserts.findIndex(x => x.id == item.id)
                if (doesExist != -1){
                    theController.myModel.asserts.splice(doesExist, 1)
                }
            }
            if (item.hasOwnProperty('allMyChildren')) item.findAssertForRemoval()
            theController.updateDisplay()
            toast_msg.showDeleted()
        }
    }

    /**
    * Toasts and pastes selected item
    *
    * @method pasteThis
    */
    static pasteThis(){
        var currentItem = theController.myView.contextTarget
        //Check if paste legal
        if (currentItem.hasOwnProperty('allMyChildren')){
            if (theController.myModel.copiedItems.length === 0){
                toast_msg.show("No item copied")
                return
            }
            var pastedItems = theController.myModel.copiedItems
            for (var item of pastedItems){
                if ( (item.type == "Suite" && currentItem.type == "Spec")){
                    toast_msg.show("Error Spec cannot contain Suites")
                    return
                }
                if ( (item.type == "Spec" && currentItem.type == "Spec")){
                    toast_msg.show("Error Spec cannot contain spec")
                    return
                }
                if ( (item.type == "BeforeEach" && currentItem.type == "Spec")){
                    toast_msg.show("Error Spec cannot contain AfterEach")
                    return
                }
                if ( (item.type == "AfterEach" && currentItem.type == "Spec")){
                    toast_msg.show("Error Spec cannot contain BeforeEach")
                    return
                }
                if ( (item.type == "Suite" && currentItem.type == "AfterEach")){
                    toast_msg.show("Error AfterEach cannot contain Suite")
                    return
                }
                if ( (item.type == "Suite" && currentItem.type == "BeforeEach")){
                    toast_msg.show("Error BeforeEach cannot contain Suite")
                    return
                }
                if ( (item.type == "Assert" && currentItem.type == "Suite")){
                    toast_msg.show("Error Suite cannot contain Assert")
                    return
                }
            }
            for (var item of pastedItems){
                currentItem.addPastedItem( item )
            }
            toast_msg.showPaste()
        }
    }

    /**
    * Toasts and cuts selected item
    *
    * @method cutThis
    */
    static cutThis(){
        let currentItem = theController.myView.contextTarget
        let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
        var parent = currentItem.parent
        theController.myModel.copiedItem = currentItem
        parent.removeChild(index)
        if (currentItem.type === "Assert"){
            let doesExist = theController.myModel.asserts.findIndex(x => x.id == currentItem.id)
            if (doesExist != -1){
                theController.myModel.asserts.splice(doesExist, 1)
            }
        }
        if(currentItem.type === "Suite" || currentItem.type === "Spec"){
            currentItem.findAssertForRemoval()
        }
        theController.updateDisplay()
        toast_msg.showCut()
    }

    /**
    * Adds spec to target
    *
    * @method addSpecToThis
    */
    static addSpecToThis(){
        var currentItem = theController.myView.contextTarget
        theController.myModel.currentSuite = currentItem
        let newItem = theController.myModel.addSpec("")
        theController.updateDisplay()
        document.getElementById(newItem.id + 't').focus()
    }

    /**
    * Adds suite to target
    *
    * @method addSuiteToThis
    */
    static addSuiteToThis(){
        var currentItem = theController.myView.contextTarget
        theController.myModel.currentSuite = currentItem
        let newItem = theController.myModel.addSuite("")
        theController.updateDisplay()
        document.getElementById(newItem.id + 't').focus()
    }

    /**
    * Adds before to target
    *
    * @method addBeforeToThis
    */
    static addBeforeToThis(){
        var currentItem = theController.myView.contextTarget
        theController.myModel.currentTestItem = currentItem
        theController.myModel.addBeforeEach()
        let newMisc = theController.myModel.addMiscCode("")
        theController.updateDisplay()
        document.getElementById(newMisc.id + 't').focus()
    }

    /**
    * Adds after to target
    *
    * @method addAfterToThis
    */
    static addAfterToThis() {
        var currentItem = theController.myView.contextTarget
        theController.myModel.currentTestItem = currentItem
        theController.myModel.addAfterEach()
        let newMisc = theController.myModel.addMiscCode("")
        theController.updateDisplay()
        document.getElementById(newMisc.id + 't').focus()
    }

    /**
    * Adds misc to target
    *
    * @method addMiscToThis
    */
    static addMiscToThis(){
        var currentItem = theController.myView.contextTarget
        theController.myModel.currentTestItem = currentItem
        let newMisc = theController.myModel.addMiscCode("")
        theController.updateDisplay()
        document.getElementById(newMisc.id + 't').focus()
    }

    /**
    * Adds assert to target
    *
    * @method addAssertToThis
    */
    static addAssertToThis(){
        var currentItem = theController.myView.contextTarget
        theController.myModel.currentTestItem = currentItem
        let newItem = theController.myModel.addAssert("", false, "toBe", "")
        theController.updateDisplay()
        document.getElementById(newItem.id + 't1').focus()
    }
}
