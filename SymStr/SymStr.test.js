require("../jasmine");
var SymStr = require("./SymStr");

describe("SymStr", function(){
	it("should be defined", function(){
		expect(typeof SymStr).toBe("function");
	});
	it("should allow dynamic strings", function(){
		var ss1 = SymStr("Hello");
		var ss2 = SymStr(" world");
		var SS = SymStr({
			append: [ss1, ss2]
		});

		expect(SS.toString()).toBe("Hello world");

		ss1.set("Goodbye");

		expect(SS.toString()).toBe("Goodbye world");
	});
});