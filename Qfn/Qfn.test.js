require("../jasmine");
var Qfn = require("./Qfn");

describe("Qfn", function(){
	it("should be defined", function(){
		expect(typeof Qfn).toBe("function");
	});
	it("should create fns", function(){
		var qfn = Qfn();

		expect(typeof qfn).toBe("function");
	});
});