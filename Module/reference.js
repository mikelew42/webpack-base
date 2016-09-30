/*
A much easier way would be to just use a $private var name
*/

var reference = module.exports = function(){
	for (var i = 0; i < arguments.length; i++){
		for (var j in arguments[i]){
			this[j] = arguments[i][j];
			this.doNotCopy = this.doNotCopy || [];
			this.doNotCopy.push(j);
		}
	}
};