var Base = require("../Base");
var is = require("../is");

var Coll = Base.extend("Coll", {
	items: [],
	config: function(){
		this.items = [];
	},
	append: function(){
		for (var i = 0; i < arguments.length; i++){
			this.items.push(arguments[i]);
		}
		// chainable api fn
		return this;
	},
	each: function(fn){
		for (var i = 0; i < this.items.length; i++){
			fn.call(this, this.items[i], i);
		}
		//chainable api fn
		return this;
	}
});

module.exports = Coll;