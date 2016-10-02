require("./styles.less");
require("font-awesome-webpack")
var Base = require("../Base");
var is = require("../is");
var $ = require("jquery");

$(function(){
	// var $body = $("body").addClass("light");
});

var View = Base.extend({
	name: "View",
	init: function(){
		this.render();
		this.insert();
	},
	render: function(){},
	insert: function(){
		if (this.$container){
			this.$container.append(this.$el);
		}
	}
});

var aliasFnToEl = function(fn){
	return function(){
		this.$el[fn].apply(this.$el, arguments);
		return this;
	};
};

[	'append', 'prepend', 'click', /* 'clickOff',*/ 'show', 'hide', 'appendTo', 'prependTo', 'addClass', 'removeClass', 
	'css', 'attr', 'remove', 'empty', 'hasClass', 'html'].forEach(function(v){
		View.prototype[v] = aliasFnToEl(v);
});

module.exports = View;