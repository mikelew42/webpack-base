// if subs are always called from the root
// and subs are always applied, or pass this as an arg
// we can safely add subs to set

// we can then override the subs, as long as we copy the base set,
// and each sub that has subs...

// attach to an object
// allow multiple args obj.set(a, b, c), each of which might be an obj or value

// aka "fnHasProps"
var shouldCopyFunction = function(fn){
	return Object.getOwnPropertyNames(fn).length > Object.getOwnPropertyNames(function(){});
};

// the problem with creating these sub fns, is that you need to copy the whole damn thing. can't we just wrap this set super function in a wrapper, to create a new one?

var copy = function(){
	var set = function(){};

	var setSubCopy = function(){
		var setSub = function(){};
		setSub.copy = setSubCopy;
		return setSub;
	};

	set.sub = setSubCopy();

	set.copy = copy;
	return set;
};
// this is clever, and I think it would work, but it's a pain in the ass to read and write...  and override...

// set could probably just be an object with .main, like the rest of them (inst and init).  but then it would have to be reinitialized frequently

// is there another way to import a bundle of functions and sub functions, to reassemble them quickly?

// no sub fns... no obj to copy, just a similar pattern as shown here.  just import an object that has all the fns, and rewrite the whole thing from scratch?

var set = {
	loop: function(){
		for (var i = 0; i < arguments.length; i++){
			set.one(this, arguments[i]);
		}
		return this;	
	},
	one: function(mod, arg){
		if (is.obj(arg))
			set.obj(mod, arg);
	},
	obj: function(mod, obj){
		for (var i in obj)
			set.prop(mod, i, obj[i]);
	},
	prop: function(mod, propName, newValue){

	}
};
// this looks nice, how does it work?
// how do we deviate from this path, overriding one of the methods, and implement it without affecting all teh rest?
// we can't modify the set object... unless we copy it?
// all these methods are bound to this original set.  If we copy (reassign) all these fns onto a new object...

var set2 = { assign: assign };
set2.assign(set, {
	prop: function(){
		// call set2 here
		set2.sub // if it hasn't been overridden, then it will be the original fn, and still bound to the original set object.
		// if it has been overridden, it will use the new one...
	}
});
// ugh - this won't work.  its all about the entry point, which stays bound to the original.  somehow we need to swap out those references to the object...

// we need to be able to copy the object, and have the correct references.  lets try it

var Set = function(){
	var set = {
		api: function(){
			set.whatever();
		},
		assign: assign
	};
	set.assign.apply(set, arguments);
	return set;
};
// :D could this be a function?  THE function?

var Set = function(){
	var set = function(){
		return set.main.apply(this, arguments);
	};

	set.assign = assign;

	set.assign({
		// default subs
		main: function(){
			for (var i = 0; i < arguments.length; i++){
				set.one(this, arguments[i]);
			}
			return this;
		},
		loop: function(){},
		one: function(mod, arg){
			if (is.obj(arg))
				set.obj(mod, arg);
			else
				set.value(mod, arg);
		},
		value: function(mod, value){
			console.warn("what to do with", value);
		},
		obj: function(mod, obj){
			for (var i in obj){
				set.prop(mod, propName, newValue);
			}
		},
		prop: function(mod, propName, newValue){

		}
	});

	// allow overrides
	set.assign.apply(set, arguments);

	return set;
};


var Sfn = function Sfn(name){
	var sfn = eval("function " + name + "(){\r\n\
	return sfn.main.apply(this, arguments);\r\n\
};");
	sfn.assign = assign;
	sfn.main = function(){};

	// skip first arg
	for (var i = 1; i < arguments.length; i++){
		sfn.assign(arguments[i]);
	}

	return sfn;
};

// - doesn't need to be copied, can be on the prototype and shared...
// - can be modified via subs, but must create a new one each time (no automated copying..)

// So now, every time we call SET, we get a new instance of the object, with all new sub functions, each bound to the new set object.  Now, when we copy set, we can "extend" it, adding new subs

var set = Set({

});

// one major limitation, is that you can't easily re-extend... So lets not add the copy method.  If you want to rework the set algorithm, you can build a new one pretty easily, but you have to start from scratch each time...
	// maybe you could, just wrap it in a new function?

	var Set2 = function(){
		var set = Set({
			// modify the base Set
		});

		// allow overrides
		set.assign.apply(set, arguments);

		return set;
	}