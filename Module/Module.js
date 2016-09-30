var Base = require("../Base");
var is = require("../is");

var track = require("../Base/track");
var instantiate = require("./instantiate");
var copy = require("./copy");
var data = require("./data");
var create = require("./create");
var install = require("./install");
var setup = require("./setup");

var Module = Base.extend({
	name: "Module",
	copy: copy,
	data: data,
	create: create,
		track: track,
		instantiate: instantiate,
		init: function(){},
	// main: function(){},
	// install: install,
	// setup: setup
});


module.exports = Module;