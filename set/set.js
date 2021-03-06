var is = require("../is");


// attach to an object
// allow multiple args obj.set(a, b, c), each of which might be an obj or value

var set = function(){
	if (arguments.length){
		for (var i = 0; i < arguments.length; i++){
			setOne(this, arguments[i]);
		}
	}
	return this;
};

var setOne = function(obj, arg){
	if (!is.obj(arg)){
		obj.value = arg; //?
	} else {
		for (var i in arg){
			setProp(obj, arg[i], i);
		}
	}
};

var setProp = function(obj, arg, name){
	if (is.undef(obj[name])) // obj.prop is undefined
		obj[name] = arg;
	else if (obj[name].set)
		obj[name].set.call(obj[name], arg); // pass to obj.prop.set()
	else if (is.obj(obj[name]) && is.obj(arg)) // recursively set
		setOne(obj[name], arg)
	else if (is.fn(obj[name])){ // if obj.prop is fn
		if (is.fn(arg))
			obj[name] = arg; // override fn with fn
		else if (is.arr(arg))
			obj[name].apply(obj, arg); // apply array
		else
			obj[name].call(obj, arg); // call with anything else
	} else {
		// standard set
		obj[name] = arg;
	}
};

module.exports = set;