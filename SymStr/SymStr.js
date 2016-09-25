var Coll = require("../Coll");
var is = require("../is");

var SymStr = Coll.extend("SymStr", {
	toString: function(){
		var ret = "";
		this.each(function(v){
			if (is.str(v))
				ret += v;
			else if (v instanceof SymStr)
				ret += v.value;
		});
		return ret;
	}
});

module.exports = SymStr;