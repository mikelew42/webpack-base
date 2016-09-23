require("../jasmine");
require("logger");

var Base = require("./Base");

// Base.log = true;

describe("Base", xlog.wrap(function describeBase(){
	it("should be a function", xlog.wrap(function aLottaWork(){
		expect(typeof Base).toBe("function");
	}));

	it("should create an instance", xlog.wrap(function createAnInstance(){
		var base = Base();
		expect(base instanceof Base).toBe(true);
	}));

	it("should be extendable", xlog.wrap(function extendable(){
		var Ext = Base.extend(),
			ext = Ext(),
			Ext2 = Base.extend("Ext2", {
				prop: 123
			}),
			ext2 = Ext2({
				prop: 456
			}),
			Ext3 = Base.extend({
				only: "props"
			});

		expect(Ext.name).toBe("BaseExt");
		expect()
	}));

	it("should extend with no args", xlog.wrap(function withNoArgs(){
		var Ext = Base.extend();

		expect(Ext.name).toBe("BaseExt");
		expect(Ext.assign).toBe(Base.assign);
		expect(Ext.set).toBe(Base.set);
		expect(Ext.prototype.assign).toBe(Base.prototype.assign);
		expect(Ext.prototype.set).toBe(Base.prototype.set);
		expect(Ext.base).toBe(Base);
		expect(Ext.prototype.type).toBe("baseExt");
		expect(Ext.prototype.constructor).toBe(Ext);

		var ext = Ext({
			prop: "yo"
		});
		expect(ext.assign).toBe(Base.prototype.assign);
		expect(ext.set).toBe(Base.prototype.set);
		expect(ext.constructor).toBe(Ext);
		expect(ext.type).toBe("baseExt");
		expect(ext.prop).toBe("yo");
		expect(Ext.prototype.prop).toBeUndefined();
		expect(Base.prototype.prop).toBeUndefined();
	}));

	it("should extend with only a name", xlog.wrap(function withOnlyName(){
		var Ext = Base.extend("Ext");

		expect(Ext.name).toBe("Ext");
		expect(Ext.prototype.type).toBe("ext");

		// copied
		expect(Ext.assign).toBe(Base.assign);
		expect(Ext.set).toBe(Base.set);
		expect(Ext.prototype.assign).toBe(Base.prototype.assign);
		expect(Ext.prototype.set).toBe(Base.prototype.set);
		expect(Ext.base).toBe(Base);
		expect(Ext.prototype.constructor).toBe(Ext);

		var ext = Ext({
			prop: "yo"
		});
		expect(ext.type).toBe("ext");
		expect(ext.prop).toBe("yo");
		expect(Ext.prototype.prop).toBeUndefined();
		expect(Base.prototype.prop).toBeUndefined();
	}));

	it("should extend with only props", function(){
		var Ext = Base.extend({
			// log: true,
			test: 123
		});

		expect(Ext.name).toBe("BaseExt");
		expect(Ext.test).toBeUndefined();
		expect(Ext.prototype.test).toBe(123);

		var ext = Ext();
		expect(ext.test).toBe(123);

		var ext2 = Ext({
			test: 456
		});
		expect(ext2.test).toBe(456);
	});
}));