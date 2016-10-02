require("./styles.less");
require("font-awesome-webpack");
var View = require("../View");
var is = require("../../is");
var $ = require("jquery");

var $div = function(name){
	return $("<div>").addClass(name);
}

var Page = View.extend({
	name: "Page",
	render: function(){
		this.renderPage();
	},
	renderPage: function(){
		this.$el = $div("page");
		this.header = Header({
			$container: this.$el
		});
		this.paper = Paper({
			$container: this.$el
		});
	}
});

var Header = View.extend({
	name: "Header",
	title: "Page Title",
	render: function(){
		this.$el = $div("header").html("<h1>"+ this.title +"</h1>");
	}
});

var Paper = View.extend({
	name: "Paper",
	render: function(){
		this.$el = $div("paper").html("<p>Lorem ipsum content.</p>");
	}
});

module.exports = Page;