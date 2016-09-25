require("./styles.less");
require("font-awesome-webpack")
var Base = require("../Base");
var is = require("../is");
var $ = require("jquery");

$(function(){
	// var $body = $("body").addClass("light");
});

var View = Base.extend("View", {
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

module.exports = View;