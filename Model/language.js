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
		this.suite = "Describe"
		this.spec = "It"
		this.assert = "Assert"
		this.beforeEach = "BeforeEach"
		this.afterEach = "AfterEach"
	}
} 