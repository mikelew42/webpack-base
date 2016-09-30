var copy = module.exports = function(){
	// if constructor called like "this.constructor", then the context is instanceof that constructor, and the "new" hack doesn't work properly...
	return this.constructor.call(null, this.data());
};