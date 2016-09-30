var is = require("../is");
var data = module.exports = function(){
	var propNames = Object.getOwnPropertyNames(this), 
		propName, 
		prop, 
		data = {};

	for (var i = 0; i < propNames.length; i++){
		propName = propNames[i];
		prop = this[propName];
		if (prop && is.fn(prop.data)){
			data[propName] = prop.data()
		} else {
			data[propName] = prop;
		}
	}

	return data;
}