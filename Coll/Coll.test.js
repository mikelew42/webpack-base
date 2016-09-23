require("../jasmine");
var Coll = require("./Coll");

describe("Coll", function(){
	it("should be defined", function(){
		expect(typeof Coll).toBe("function");
	});
	it("should append items", function(){
		var coll = Coll({
			// log: true,
			append: [1, true, "three"]
		});

		expect(coll.items.length).toBe(3);
		expect(coll.items[0]).toBe(1)
		expect(coll.items[1]).toBe(true)
		expect(coll.items[2]).toBe("three")
	});
});