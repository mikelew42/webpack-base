var create = module.exports = function(o){
	this.track();
	this.instantiate();

	// once all properties are in place, now we can assign new modifiers and configure them however we want
	this.set.apply(this, arguments);

	// at this point, everything should be configured, and nothing should really have happened yet...
	this.autoInit !== false && this.init.call(this.ctx || this);
};