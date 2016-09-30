require("../jasmine");
var is = require("../is");
var Module = require("./Module");

describe("Module", function(){
	it("should be defined", function(){
		expect(typeof Module).toBe("function");
	});
	it("should create instances", function(){
		var mod = Module();
		expect(typeof mod).toBe("object");
		expect(mod instanceof Module).toBe(true);
		expect(mod.constructor).toBe(Module);
		// console.log(mod);
		window.mod = mod;
	});
	it("should be copyable", function(){
		var mod = Module({
			prop: 5
		});
		var mod2 = mod.copy();
		expect(mod).not.toBe(mod2);
		expect(mod.id).toBe(mod2.id);
		expect(mod.prop).toBe(mod2.prop);
	});
	xit("should create instances", function(){
		var module1 = Module();
		expect(is.num(module1.id)).toBe(true);
		// console.log('module1', module1);


		var ctx2, module2 = Module({
			name: "module2",
			init: function(){
				// console.log('this is module2.init');
				ctx2 = this;
			}
		});
		// console.log(module2);
		expect(ctx2).toBe(module2);

		var ctx3, module3 = Module({
			name: "module3",
			init: Module({
				name: "init",
				doNotExec: true,
				main: function(){
					// console.log('this is module3.init.main')
					ctx3 = this;
				}
			})
		});
		expect(ctx3).toBe(module3.init);
		expect(ctx3.parent).toBe(module3);
	});

	xit("should be extendable", function(){
		var MyModule1 = Module.extend("MyModule1", {});
		expect(MyModule1.init).toBeUndefined();

		var ctx2, MyModule2 = Module.extend("MyModule2", {
			init: function(){
				console.log("this is MyModule2.init");
				ctx2 = this;
			}
		});

		expect(ctx2).toBeUndefined();
		var myModule2 = MyModule2();
		expect(ctx2).toBe(myModule2);

		var ctx3, MyModule3 = MyModule2.extend("MyModule3", {
			// init: function(){
			// 	ctx3 = this;
			// }
		});

		expect(ctx3).toBeUndefined();
		var myModule3 = MyModule3();
		// expect(ctx3).toBe(myModule3);
		expect(ctx2).toBe(myModule3);

		var ctx4, MyModule4 = MyModule2.extend("MyModule4", {
			init: Module({
				name: "init",
				autoInit: false,
				main: function(){
					ctx4 = this;
				}
			})
		});

		expect(ctx4).toBeUndefined();
		var myModule4 = MyModule4();
		expect(ctx4).toBe(myModule4.init);
		expect(ctx4.parent).toBe(myModule4);
	});
});