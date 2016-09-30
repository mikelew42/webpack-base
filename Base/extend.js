var createConstructor = require("./createConstructor");
var extend = function(o){
	var name, props, Ext, logArgs;

	name = (o && o.name) || (this.name + "Ext");
	
	Ext = createConstructor(name);

	// copy this.props to Ext
	Ext.assign(this);

	Ext.prototype = Object.create(this.prototype);
	Ext.prototype.constructor = Ext;
	Ext.base = this;
	Ext.prototype.type = name[0].toLowerCase() + name.substring(1);

	Ext.prototype.set.apply(Ext.prototype, arguments);

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
};
module.exports = extend;