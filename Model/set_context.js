class set_context{
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
    static copyThis(){
        theController.myModel.setCopiedItem(theController.myView.contextTarget)
        toast_msg.showCopy()
    }

    static cloneThis(){
        var currentItem = theController.myView.contextTarget
        let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
        currentItem.parent.cloneChild(index, true)
        toast_msg.showClone()
    }

    static deleteThis(){
        if (confirm('Are you sure you want to delete this item and all of its subitems?')) {
            if (theController.myView.contextTarget !== undefined){
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
    }

    static pasteThis(){
        var currentItem = theController.myView.contextTarget
        //Check if paste legal
        if (currentItem.hasOwnProperty('allMyChildren')){
            if (theController.myModel.copiedItems.length === 0){
                toast_msg.show("No item copied")
                return
            }
            var pastedItems = theController.myModel.getCopiedItems()
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
    static cutThis(){
        let currentItem = theController.myView.contextTarget
        let index = currentItem.parent.allMyChildren.findIndex(x => x.id == currentItem.id)
        var parent = currentItem.parent
        theController.myModel.setCopiedItem(currentItem)
        parent.removeChild(index)
        console.log("HERE")
        console.log(currentItem)
        if(currentItem.type === "Suite" || currentItem.type === "Spec"){
            currentItem.findAssertForRemoval()
        }


        theController.updateDisplay()
        toast_msg.showCut()
    }
    static addSpecToThis(){
        var currentItem = theController.myView.contextTarget
        theController.myModel.setCurrentSuite(currentItem)
        modal_content.setAddSpec()
        theController.myView.modal.style.display = "block"
        document.getElementById("modalDescription").focus()
    }
    static addSuiteToThis(){
        var currentItem = theController.myView.contextTarget
        theController.myModel.setCurrentSuite(currentItem)
        modal_content.setAddSuite()
        theController.myView.modal.style.display = "block"
        document.getElementById("modalDescription").focus()
    }
    static addBeforeToThis(){
        theController.myModel.setCurrentSuite(theController.myView.contextTarget)
        theController.myModel.addBeforeEach()
        theController.myModel.addMiscCode("")
        theController.updateDisplay()
    }
    static addAfterToThis() {
        theController.myModel.setCurrentSuite(theController.myView.contextTarget)
        theController.myModel.addAfterEach()
        theController.myModel.addMiscCode("")
        theController.updateDisplay()
    }
    static addMiscToThis(){
        theController.myModel.setCurrentTestItem(theController.myView.contextTarget)
        var newMisc = theController.myModel.addMiscCode("")
        theController.updateDisplay()
        //focus on new misc
        var titleElement = document.getElementById(newMisc.id + 't').focus()
    }
    static addAssertToThis(){
        console.log("assert func")
        theController.myModel.setCurrentTestItem(theController.myView.contextTarget)
        modal_content.setAddAssert()
        theController.myView.modal.style.display = "block"
        document.getElementById("modalDescription").focus()
    }

}
