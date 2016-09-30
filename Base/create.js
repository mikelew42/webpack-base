
var create = module.exports = function(o){
	this.track();
	if (o && o.config){
		this.config = o.config;
		delete o.config;
	}
	this.config && this.config();
	this.set.apply(this, arguments);
	this.init && this.init();
	this.constructor.log && this.logNew.apply(this, arguments);
};