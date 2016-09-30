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
			Ext2 = Base.extend({
				name: "Ext2",
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
		var Ext = Base.extend({
			name: "Ext"
		});

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


var Sfn = require("./Sfn");

describe("Sfn", function(){
	it("should be a constructor for a function", function(){
		var sfn = Sfn();
		expect(typeof sfn).toBe("function");
	});

	it("should invoke .main when called", function(){
		var test = {}, sfn = Sfn({
			main: function(){
				test.one = true
			}
		});

		expect(test.one).not.toBe(true);
		sfn();
		expect(test.one).toBe(true);
	});

	it("should work properly", function(){
		var test = {},
			parent = {},
			mySfn = Sfn({
				name: "mySfn",
				main: function(){
					test.ctx = this;
					this.mySfn.sub.call(this);
					this.mySfn.selfSub(this);
				},
				sub: function(){
					test.sub = true;
					test.subCtx = this;
				},
				selfSub: function(parent){
					test.selfSub = true;
					test.selfSubCtx = this;
					test.selfSubParent = parent;
				}
			});

		// should use .name dynamically, so .name property works
		expect(mySfn.name).toBe("mySfn");

		parent.mySfn = mySfn;

		expect(test.ctx).toBeUndefined();
		expect(test.sub).toBeUndefined();
		expect(test.subCtx).toBeUndefined();
		expect(test.selfSub).toBeUndefined();
		expect(test.selfSubCtx).toBeUndefined();
		expect(test.selfSubParent).toBeUndefined();
		
		parent.mySfn();

		expect(test.ctx).toBe(parent);
		expect(test.sub).toBe(true);
		expect(test.subCtx).toBe(parent);
		expect(test.selfSub).toBe(true);
		expect(test.selfSubCtx).toBe(parent.mySfn);
		expect(test.selfSubParent).toBe(parent);
	});

	it("should work on a prototype", function(){
		var test = {},
			Ext = Base.extend({
				sfn: Sfn({
					main: function(){
						this.sfn.subType1.apply(this, arguments);
						this.sfn.subType2(this);
					},
					subType1: function(){
						// this === parent
						test.subType1Ctx = this;
						// this type is good for applying all arguments without juggling them
						// and for when you want your function to behave as if it were attached to the parent directly
					},
					subType2: function(parent){
						// this === parent.sfn
						// this type is good when you'll be calling a lot of subs, and don't want to apply the fns every time
						test.subType2Ctx = this;
						test.subType2Parent = parent;
					}
				})
			});

		expect(typeof Ext.prototype.sfn).toBe("function");
		expect(typeof Ext.prototype.sfn.main).toBe("function");

		
		var ext = Ext();
		var ext2 = Ext();

		expect(typeof ext.sfn).toBe("function");
		expect(typeof ext.sfn.main).toBe("function");

		expect(ext.sfn).toBe(ext2.sfn);

		ext.sfn();
		expect(test.subType1Ctx).toBe(ext);
		expect(test.subType2Ctx).toBe(ext.sfn);
		expect(test.subType2Parent).toBe(ext);

		ext2.sfn();
		expect(test.subType1Ctx).toBe(ext2);
		expect(test.subType2Ctx).toBe(ext2.sfn);
		expect(test.subType2Parent).toBe(ext2);

		// wrap any sfn in a constructor, and reuse the constructor to copy it
		// wrap the instantiation and extension of a sfn in a Constructor to "extend" the base constructor

		// var ext3 = Ext({
		// 	sfn: Ext.prototype.sfn.copy({
		// 		subType1: function(){
		// 			test.subType1Ctx = this;
		// 		}
		// 	})
		// });

		// expect(ext3.sfn).not.toBe(ext.sfn);
		// expect(ext3.sfn.subType1).not.toBe(ext.sfn.subType1);
		// expect(ext3.sfn.subType2).toBe(ext.sfn.subType2);

		// ext3.sfn();
		// expect(test.subType1Ctx).toBe(ext3);
	});

	it("a potential pattern for Sfn", function(){
		// So you don't have to access the base prototype to copy it...
		var test = {},
			MySfn = function(){
				var mySfn = Sfn({
					name: "mySfn",
					main: function(arg){
						this.mySfn.sub1.apply(this, arguments);
						this.mySfn.sub2(this, arg);
						this.mySfn.sub3();
					},
					sub1: function(){
						test.sub1Ctx = this;
					},
					sub2: function(parent){
						test.sub2Ctx = this;
						test.sub2Parent = parent;
					},
					sub3: function(){
						test.sub3 = 1;
					}
				});
				mySfn.assign.apply(mySfn, arguments);
				return mySfn;
			},
			Ext = Base.extend({
				mySfn: MySfn()
			});


		var ext = Ext();
		expect(typeof ext.mySfn).toBe("function");
		// expect(ext.mySfn.sub3).toBe(MySfn().sub3); // nope - it creates all new fns

		ext.mySfn();
		expect(test.sub3).toBe(1);

		var ext2 = Ext({
			mySfn: MySfn({
				sub3: function(){
					test.sub3 = 2;
				}
			})
		});
		ext2.mySfn();
		expect(test.sub3).toBe(2);

		// always test to make sure the original wasn't overridden
		ext.mySfn();
		expect(test.sub3).toBe(1);

		var Ext2 = Ext.extend({

		});
	});
});