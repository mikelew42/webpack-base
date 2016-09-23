require("../jasmine");
var Q = require("./Q");
var Base = require("../Base");

describe("Q", function(){
	it("should be defined", function(){
		expect(typeof Q).toBe("function");
	});
	it("should alias then to append", function(){
		var test1 = false,
			thirdArg = false,
			q = Q({
				then: [function(a, b, c){
					test1 = true;
					thirdArg = c;
				}]
			});

		expect(test1).toBe(false);
		expect(thirdArg).toBe(false);
		q.exec(1, true, "three");
		expect(test1).toBe(true);
		expect(thirdArg).toBe("three");


		/// 
		q.then(function(){
			test1 = "Fred";
			thirdArg = 123;
		});

		expect(test1).toBe(true);
		expect(thirdArg).toBe("three");

		q.exec(1, 2, 123);

		expect(test1).toBe("Fred");
		expect(thirdArg).toBe(123);


	});
	it("could be an event", function(){
		var obj = {
			event: Q()
		};

		var test = {};

		obj.event.then(function(){
			test.one = true;
		});

		expect(test.one).toBeUndefined();

		obj.event.exec();

		expect(test.one).toBe(true);
	});

	it("could be a dynamic fn", function(){
		var Module = Base.extend("Module", {
			config: function(){

				this.dynamic = Q({
					ctx: this,
					then: [function(){
						test.ctx = this;
						test.count++;
					}]
				}); // or you could do an inline approach:
				// this.dynamic = Q({ctx:this}).then(function(){...})

			}
		}), test = { count: 0 };

		var mod = Module();
		var mod2 = Module();

		expect(mod.dynamic instanceof Q).toBe(true);
		expect(mod2.dynamic instanceof Q).toBe(true);
		expect(mod.dynamic).not.toBe(mod2.dynamic);
		expect(test.count).toBe(0);

		mod.dynamic.exec();
		expect(test.count).toBe(1);
		expect(test.ctx).toBe(mod);

		mod2.dynamic.exec();
		expect(test.count).toBe(2);
		expect(test.ctx).toBe(mod2);
	});

	it("could be added just for an instance?", function(){
		// maybe this is an anti pattern, but lets try it..
		var Module = Base.extend("Module");
		// Module.set({ props }) is the same as if we put props above...

		var mod = Module({
			// what if config already has some logic?
			config: function(){
				this.dynamic = Q();
			}
		});

		console.log(mod);

		expect(mod.dynamic instanceof Q).toBe(true);
	});


// !! must add Q's from init or config!!
	xit("could be a dynamic function", function(){
		var Module = Base.extend("Module", {
			dynamic: Q()
		}), test = {};

		var mod = Module();
		var mod2 = Module();

		mod.dynamic.then(function(arg){
			test.one = true;
			test.arg = arg;
		});
		
		mod2.dynamic.then(function(){
			test.one = "nope";
		});

		expect(test.one).not.toBe(true);

		mod.dynamic.exec(123);

		expect(test.one).toBe(true);
		expect(test.arg).toBe(123);



	});
	it("could be a dynamic function2", function(){
		var Module = Base.extend("Module", {
			dynamic: Q({

			})
		}), test = {};

		var mod = Module();
		var mod2 = Module();

// not intended!!
		expect(mod.dynamic).toBe(mod2.dynamic);

		mod.dynamic.then(function(arg){
			test.one = true;
			test.arg = arg;
		});

		expect(test.one).not.toBe(true);

		mod.dynamic.exec(123);

		expect(test.one).toBe(true);
		expect(test.arg).toBe(123);
	});
});