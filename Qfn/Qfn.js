var is = require("../is");
var Sfn = require("../Base/Sfn");
var assign = require("../Base/assign");
var argsToArray = require("../Base/argsToArray");


/*
We *have* to know the name of the sfn in the other pattern.  Alternatively, we have bound access to the sfn, when we're creating it.  And, although we need to dynamically access "this", we can bind to the actual qfn... Right?  Every time we edit the Qfn, we'll copy it, and rebind.  I think that should work properly.  Let's find out.

We can either use this === qfn, and pass parent as the first arg to all the fns.  Or, we can use this === parent, and pass qfn to all the fns...

Do we ever invoke subs directly?
mod.someQ.then(fn(){})
	// yep

.then doesn't need access to the parent, it just adds the subs, and only needs "this" to be the Q.

mod.someQ() --> .main --> .exec

The main difference with the sfn that's working, is that the sfn's .main is called with this===parent, and so .main has to use this[sfn.name].subs, and that's not really... great.

Well, wait a second.  If we're modifying the prototype, this is ok.

Mod = Module.extend({
	qfn: Qfn()
});

then 

Mod2 = Mod.extend({
	qfn: {
		then: function(){}
	}
});

or even

Mod2 = Mod.extend({
	qfn: function(){}, // auto Q it, and use assign: {} to override it
	qfn: {
		sub: function(){} // auto Q it, and use assign: {} to just add it?
		assign: {
			// add a sub, without Quing it
		}
	}
});

But honestly, all this magic bullshit is what confuses things in the first place.  I tried to create an ultra simple framework, and I'm already back at Sfns and Qfns...  These are going to drive me crazy!!



A convoluted solution:  Have a way to rebind to the Qfn.  Like:

Qfn({
	instrument: {
		propName: function(qfn){
			return value;
		}
	} // here, the returned qfn.propName will be the value
});

This way, we can create a function like .main or .exec that can use "this" as the parent, but also have a local binding to the qfn.

When a qfn is copied, though, we can't just reassign the qfn's subs like we do with a sfn currently.  We'd need to re-instrument them.

Damn, that would probably work, but fuck... its getting complicated again.

The Sfn only has one entry point, and then uses a less than optimal API (passing "this" around afterwards).


Or maybe we assign the returned qfn to a var, so we can bring it into our fns:

var qfn = Qfn({
	fn: function(){
		qfn || this == parent
	}
});

the problem here, is that we can't use it inline:

Mod = Module({
	qfn: Qfn() // ... we can't access it yet
});



*****

How about the combo as .main?

.main() --> .exec() // NO ARGS ALLOWED FOR Qs?

Or, you could just do a tricky apply...
mod.qfn.exec.apply(mod, [mod.qfn, ... otherArgs ])


And then:
.main(function(){} || {} || any?) --> .set() 

This way, you could only use the qfn by invoking it, rather than access (invoke) any of its subs.

SUMMARY OF POTENTIAL SOLUTIONS

.main only API:  DON'T ACCESS QFN.SUBS + NO ARGS (or just no fn/obj args) can be applied to .exec

Instrumentation:  Several possible ways to bind to the qfn:
{
	qfn: Qfn(function(qfn){
		qfn.assign({
			
		});
	})
}
 

If we go the .main -> .exec/.set combo, the easiest way is to just check arguments.length, and route any/all args to .set.

Can we just use a Sfn?  
.main is called with parent ctx, so .exec and .set would be also.  But, that means that .set and .exec need to be passed the Qfn directly...   God damn, that's ugly.


Or maybe we just get into instantiating sfns on every instance, and binding to it?  I was already planning to "install" / "setup" modules.

If we restrict the use of these "Qfn" to fns where we know the name, it could work.  Or, the Qfn installs it at the named property?




*/
var Qfn = function(){
	var name = "qfn",
		props = {
			assign: assign
		};

	if (o && o.name)
		props.name = o.name;

	props.assign.apply(props, arguments);

	eval("var " + name + ";");

	// var qfn = eval("(" + name + " = function " + name + "(){\r\n\
	// var args = argsToArray(arguments);
	// args.unshift(this);
	// return qfn.main.apply(qfn, ")



	var qfn = Sfn({
		name: "qfn",
		constructor: Qfn,
		main: function(){
			this 
		}
	});
	return qfn;
};