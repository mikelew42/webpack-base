var set = require("../set");
var is = require("../is");
var createConstructor = require("./createConstructor");
var track = require("./track");
var extend = require("./extend");
var create = require("./create");
// creates a global on the window object, doesn't return anything
require("logger");


// Base constructor
var Base = createConstructor("Base");

Base.assign({
	set: set,
	extend: extend
});

// Base.prototype
Base.prototype.assign({
	set: set,
	track: track,
	create: create,
	init: function(){}
});

module.exports = Base;