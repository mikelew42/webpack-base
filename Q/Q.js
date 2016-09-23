var Coll = require("../Coll");
var is = require("../is");

var Q = Coll.extend("Q", {
	then: function(){
		this.append.apply(this, arguments);
		return this;
	},
	exec: function(){
		var args = arguments;
		this.each(function(cb, i){
			cb.apply(this.ctx || this, args);
		});
	}
});

module.exports = Q;