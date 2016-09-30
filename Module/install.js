var install = module.exports = function(name, module){
	this[name] = module;
	this[name].setup(this);
};