/*
jshint esversion:6, jshint asi:true
*/
/**
* language
*
* @class language
* @constructor
*/
class language{
	/**
	* Class Constructor
	*
	* @method Constructor
	*/
	constructor(){
		this.suite = ""
		this.spec = ""
		this.assert = ""
		this.beforeEach = ""
		this.afterEach = ""
	}
}
/**
* jasmineLanguage
*
* @class jasmineLanguage
* @constructor
*/
class jasmineLanguage extends language{
	/**
	* Class Constructor
	*
	* @method Constructor
	*/
	constructor(){
		super()
		this.suite = "describe"
		this.spec = "it"
		this.assert = "expect"
		this.beforeEach = "beforeEach"
		this.afterEach = "afterEach"
	}
}
