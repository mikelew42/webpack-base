var set = require("../set");
var is = require("../is");
require("logger");

var nextID = 0;

var assign = function(){
	// allow multiple objects
	for (var i = 0; i < arguments.length; i++){
		// make sure its an object
		if (is.obj(arguments[i])){
			// loop over each property
			for (var j in arguments[i]){
				// assign it to this
				this[j] = arguments[i][j];
			}
		}
	}
};
var argsToArray = function(args){
	return Array.prototype.slice.call(args);
};
// convert arguments to array and add a null context for the binding
var prepArgs = function(args){
	args = argsToArray(args);
	args.unshift(null);
	return args;
};

// TODO make this a normal function, use fn.toString() and then some str replacing 
// to allow a normal function to be passed, that uses a special.. "Constructor" name
// as the placeholder for the variable name?
		// this allows a new constructor template function to be used similarly below,
		// without having to do all the special concatenation...
var createConstructor = function(name){
	eval("var " + name + ";");
	var ret = eval("(" + name + " = function " + name + "(o){\r\n\
	if (!(this instanceof " + name + "))\r\n\
		return new (" + name + ".bind.apply(" + name + ", prepArgs(arguments)));\r\n\
	this.id = ++nextID;\r\n\
	if (o && o.config) this.config = o.config;\r\n\
	this.config && this.config();\r\n\
	this.set.apply(this, arguments);\r\n\
	this.init && this.init();\r\n\
	this.log && this.logNew.apply(this, arguments);\r\n\
});");
	return ret;
}

var Base = createConstructor("Base");
Base.assign = assign;
Base.set = set;
Base.prototype.assign = assign;
Base.prototype.set = set;

Base.extend = xlog.wrap(function Base_extend(nameOrProps, undefOrProps){
	var name, props, Ext, logArgs;
	if (typeof nameOrProps === "string"){
		name = nameOrProps; // first arg is name
		if (typeof undefOrProps === "object"){
			props = undefOrProps; // second arg is props
		}
	} else if (typeof nameOrProps === "object"){
		props = nameOrProps; // first arg is props
	}

	if (!name){
		if (this.name)
			name = this.name + "Ext";
		else
			name = "NoName";
	}
	
	Ext = createConstructor(name);

	for (var i in this){
		Ext[i] = this[i];
	}

	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.base = this;
	Ext.prototype.type = name[0].toLowerCase() + name.substring(1);

	if (props)
		Ext.prototype.set(props);

	// log("Created new class: ", Ext);
	if (this.log){
		// logArgs = argsToArray(arguments);
		// logArgs.unshift("class " + Ext.name + " extends " + this.name + " (");
		// logArgs.push(")");
		log.groupc("class " + Ext.name + " extends " + this.name + " {", props || "", "}");
			console.dir(this);
			console.log("+", props, "=");
			console.dir(Ext);
		log.end();
	}
	return Ext;
});

/*



*/

Base.prototype.init = function(){

};

Base.prototype.logNew = function(){
	var args = argsToArray(arguments);
	args.unshift("new " + this.constructor.name + "(");
	args.push(") ==> ", this);
	log.apply(log, args);
};

var Test = function Test(){
	if (!(this instanceof Test))
		return new (Test.bind.apply(Test, prepArgs(arguments)));
};

// Base.Test = Test;
module.exports = Base;