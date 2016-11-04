/*
jshint esversion:6, jshint asi:true
*/
class language{
	constructor(){
		this.suite = ""
		this.spec = ""
		this.assert = ""
		this.beforeEach = ""
		this.afterEach = ""
	}
}

class jasmineLanguage extends language{
	constructor(){
		super()
		this.suite = "describe"
		this.spec = "it"
		this.assert = "expect"
		this.beforeEach = "beforeEach"
		this.afterEach = "afterEach"
	}
}
