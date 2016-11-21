/*
jshint esversion:6, jshint asi:true
*/

/**
* A Suite
*
* @class Suite
* @constructor
*/
class Suite extends TestItem{
	/**
	* Class Constructor
	*
	* @method Constructor
	* @param {string} newDesc
	* @param {TestItem} newParent
	*/
	constructor (newDesc, newParent = "None") {
		super(newDesc, "Suite", newParent)
		this.allMyChildren = []
	}

	/**
	* Creates and adds a beforeEach testitem to the start of the allMyChildren array
	*
	* @method addBefore
	* @return {BeforeEach} aBefore
	*/
	addBefore () {
		let aBefore = new BeforeEach(this)
		this.allMyChildren.unshift(aBefore)
		return aBefore
	}

	/**
	* Creates and adds a beforeEach testitem to the end of the allMyChildren array
	*
	* @method addBefore
	* @return {BeforeEach} aBefore
	*/
	addBeforeToEnd () {
		let aBefore = new BeforeEach(this)
		this.allMyChildren.push(aBefore)
		return aBefore
	}

	/**
	* Creates and adds an afterEach testitem to the start of the allMyChildren array
	*
	* @method addAfter
	* @return {AfterEach} aAfter
	*/
	addAfter () {
		let aAfter = new AfterEach(this)
		this.allMyChildren.unshift(aAfter)
		return aAfter
	}

	/**
	* Creates and adds an afterEach testitem to the end of the allMyChildren array
	*
	* @method addAfter
	* @return {AfterEach} aAfter
	*/
	addAfterToEnd () {
		let aAfter = new AfterEach(this)
		this.allMyChildren.push(aAfter)
		return aAfter
	}

	/**
	* Creates and adds a spec to allMyChildren
	*
	* @method addSpec
	* @return {Spec} aSpec
	*/
	addSpec (itStr, newParent) {
		let aSpec = new Spec(itStr, newParent)
		this.allMyChildren.push(aSpec)
		return aSpec
	}

	/**
	* Creates and adds a suite to allMyChildren
	*
	* @method addSuite
	* @return {Suite} aSuite
	*/
	addSuite (itStr, newParent) {
		let aSuite = new Suite(itStr, newParent)
		this.allMyChildren.push(aSuite)
		return aSuite
	}

	/**
	* Returns the string output of this item and all of its children
	*
	* @method toString
	* @return {string} resultStr
	*/
	toString (tabNum) {
		let resultStr, theTab, child
		let tab = "    "
		theTab = tabNum
		resultStr = tab.repeat(theTab) + "describe(\"" + this.description + "\", function() {\r\n"
		theTab = theTab + 1

		for (child of this.allMyChildren) {
			resultStr +=  child.toString(theTab) + "\r\n"
		}
		resultStr += tab.repeat(theTab - 1) + "});\r\n"
		return resultStr
	}

	/**
	* Returns a child that matches the id parameter
	*
	* @method toString
	* @return {string} resultStr
	*/
	findChild (theId){
		for (let child of this.allMyChildren){
			if (child.id === theId){
				return child
			}
			if(child.hasOwnProperty('allMyChildren')){
				let result = child.findChild(theId)

				if(result !== undefined){
					return result
				}
			}
		}
	}
}
