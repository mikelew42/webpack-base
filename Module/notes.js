// let's stick to init and render for these views, for now.
// if we have 
Module.extend({
	init: function(){}, // if init.set, then this can be auto Q'd?
		// if not, we'd need to stick to an object:
	init: {
		main: function(){
			/* if we're going to have init as a "machine" without being an auto Q, it wouldn't make much sense to have init called with parent context.. we'll want to be able to create an init sequence by calling this.subs (init.subs)

			We can setup this init machine, and have either a simple list of calls here:
			this.sub1();
			this.sub2();
			//...

			Or, we could have any amount of logic:
			if(this.someCondition())
				this.sub1();
			else
				this.sub2();

			Then, we can override these subs, or even the main fn... We can encapsulate to try to optimize the amount of override points, without making it unmanageable

			Init could be optional..?  It could be a normal function, or it could be a module...

			var MyModule = Module.extend({
				init: function(){
					this === new MyModule
				},
				// or
				init: {
					main: function(){
						this.sub();
					},
					setup: function(parent){
						this.parent = parent;
					}
				},
				// or 
				init: Module(function(){
					// this gets set to init.main
					this.sub();
				}, {
					setup: function(parent){
						this.parent = parent; // default, but can override to realias as anything
					},
					// these are the subs
					sub: function(){
						this.parent;
					}
				})
			});

			module.set(fn) --> module.main = fn instead of module.value... */
		}
	},
});

var machine = {
	install: function(parent){
		this.parent = parent;
	},
	main: function(){
		this.subWithMachineCtx();  // called with machine as context
		this.subWithParentCtx.call(this.parent);
	},
	subWithMachineCtx: function(){
		// this === machine
		this.parent.parentMethod();
		this.anotherMachineSub();
	},
	subWithParentCtx: function(){
		// this === parent
		this.parentMethod();
		this[machinePropName].anotherMachineSub(); // have to couple these calls based on the machine's prop name
	}
};

// or, you could call .main with .parent ctx from .initialize...
var rootedMachine = {
	main: function(){
		// this === parent
		this.sub(); // a parent.sub
		this.init.sub(); // an init.sub...
	}
};

// and how about copying the machines?
// machine.install seems like a good place to do it
machine.install = function(parent){
	this.parent = parent; // this is wrong - this is the prototype's machine
	var c = parent[this.name] = this.copy();
	c.parent = parent;
};

// but then the machine.copy needs to be different for obj vs modules?
// modules need to use their constructor and hasOwn props.
// objects can just do a deep copy...

// maybe .install should be associated with the first part, actually
// adding a module, which can setup the module.name.

// module.setup can do this re-installation onto the new parent.

module.set({
	some: MyModule()
}) // ==> module.install('some', MyModule())
// ==> module.some = MyModule();
// ==> module.some.parent = module

// for the class
ModuleA = Module.extend("ModuleA", {
	b: ModuleB({ /* creates an instance on the prototype.. */ })
});

// But, for this generic system, we need to make sure to setup each module
// on the instance.  So, when we install the module b above, we could
// track it, in order to set it up...
// This means, in the parent module.initialize, we need to .initializeSubs
// or just call module._subs[].setup(module)
// Or, we could try to just loop through all props, and if it has a .setup? fn,
// then we set it up...? 

// in reality, you can use either one, its all preference.  I guess it depends
// on how often you use each context..
// if you use both, its probably a wash
// if you never call one init.sub from another init.sub, then you probably
// just want to root it...

// Also, how about the autoQ?  Let's try to hold off on this for now..
