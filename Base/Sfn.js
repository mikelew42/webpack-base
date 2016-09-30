var assign = require("./assign");
var argsToArray = require("./argsToArray");

var Sfn = function Sfn(o){
	var name = "sfn",
		props = {
			assign: assign
		};

	// if first arg is a sfn, it won't get assigned below, because the fn.name property is not enumerable.  This should work to reuse that name, unless another one is passed in afterwards...
	if (o && o.name)
		props.name = o.name;


	// merge down all the arguments onto this temporary object, so the prevailing .name can be found
	props.assign.apply(props, arguments);

	name = props.name || name;
	
	eval("var " + name + ";");
	
	var sfn = eval("(" + name + " = function " + name + "(){\r\n\
	return sfn.main.apply(this, arguments);\r\n\
});");
	
	sfn.assign = assign;

	sfn.assign({
		main: function(){},
		constructor: Sfn,
		toString: function(){
			return "sfn " + this.name;
		},
		copy: function(){
			var args = argsToArray(arguments);
			args.unshift(this);
			return this.constructor.apply(null, args);
		}
	}, props); // overrides
	
	return sfn;
};


module.exports = Sfn;