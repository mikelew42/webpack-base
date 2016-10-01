var is = require("../is");
var Base = require("../Base");
/**
What if the arr has referential values?  Do we do a deep copy?
Maybe a deep copy should be done by default?
Now we need a more robust copy algorithm?

Instead of just value.copy(), we need copy(value)?


- lets just get this working for the typical prototypical array - the empty array
- often this array wil need to be instantiated before "set" because set might add some cbs, for example...
- when it comes to the contents of the array, maybe i should write a warning here, so its not overlooked.


Honestly, this is pretty heavy... It would be way more performant to hard-code only the properties needed.  This will be possible with code gen.
*/

var instantiate = module.exports = function(proto){
	for (var i in this){
		if (i[0] === "$")
			continue;
		if (this[i]){
			// natural sfn shouldn't need reinstantiation, unless its a prototype
			if (this[i].copy && (!is.sfn(this[i]) || proto)) {
				this[i] = this[i].copy();
			} else if (this[i] instanceof Base){
				console.warn("potentially dangerous use of sub modules");
			} else if (is.obj(this[i]))
				this[i] = copyObj(this[i]);
			else if (is.arr(this[i]))
				this[i] = copyArr(this[i]);
		}
	}
};

var copyObj = function(obj){
	var c = {};
	for (var i in obj){
		if (is.simple(obj[i]) || is.fn(obj[i]))
			c[i] = obj[i];
		else {
			console.warn("potentially dangerous reinstantiation of object");
			c[i] = obj[i];
		}
	}
};

var copyArr = function(arr){
	var c = [];
	for (var i = 0; i < arr.length; i++){
		if (is.simple(arr[i]) || is.fn(arr[i]))
			c[i] = arr[i];
		else {
			console.warn("potentially dangerous reinstantiation of array");
			// if the array contents are shared between base class and ext class, or class and instance, then you have the potentially for the latter to affect the former
			c[i] = arr[i];
		}
	}
}