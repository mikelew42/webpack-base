require("../jasmine");
var assign = require("./set");

describe("assign", function(){
	it("should be defined", function(){
		expect(typeof assign).toBe("function");
	});
});