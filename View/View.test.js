// require("../jasmine");
var View = require("./View");
var $ = require("jquery");
var is = require("../is");

var $div = function(name){
	return $("<div>").addClass(name);
}

var Item = View.extend("Item", {
	render: function(){
		this.renderSimpleItem();
	},
	renderItem: function(){
		this.$el = $("<div>").addClass("item");
		return this.$el;
	},
	renderSimpleItem: function(){
		this.renderItem();
		this.$el.addClass("pad-self").html(is.def(this.value) && this.value || "Item");
	}
});

var ValueItem = Item.extend("ValueItem", {
	render: function(){
		this.renderItem();
		this.renderValueItem();
		this.renderText();
		this.renderValue();
	},
	renderValueItem: function(){
		this.$el.addClass('value-item pad-children ' + typeof this.value);
	},
	renderText: function(){
		this.$name = $div('name').html(this.name || "ValueItems").appendTo(this.$el);
	},
	renderValue: function(){
		this.$value = $div('value ' + typeof this.value).html(is.def(this.value) && this.value.toString()).appendTo(this.$el);
	}
});

var Icon = View.extend("Icon", {
	value: "circle",
	render: function(){
		this.$el = $("<i>").addClass("icon fa fa-fw fa-" + this.value);
	},
	setIcon: function(name){
		this.$el.removeClass("fa-"+this.value).addClass("fa-"+name);
		this.value = name;
	}
});

var IconItem = Item.extend("IconItem", {
	icon: "plane",
	render: function(){
		this.renderItem();
		this.$el.addClass("icon-item pad-children");
		this.icon = Icon({
			value: this.icon || "circle",
			$container: this.$el
		});
		this.$name = $div("name").html(is.def(this.value) && this.value.toString()).appendTo(this.$el);
	}
});

var tests = function($container){
	var simpleItem = Item('simpleItem').$el.appendTo($container);
	var simpleItem2 = Item('simpleItem2', {
		$container: $container
	});
	var valueItem = ValueItem({
		name: "valueItem",
		value: 123,
		$container: $container
	});
	var valueItem2 = ValueItem({
		name: "valueItem2",
		value: false,
		$container: $container
	});
	valueItem2.$el.$value2 = $div('value string').html("test value").appendTo(valueItem2.$el);
	
	var iconItem = IconItem({
		icon: "beer",
		value: "iconItem",
		$container: $container
	})
};

$(function(){
	var $panel = $div("panel light").appendTo("body").append("<h3>LIGHT</h3>");
	var $outlines = $div("panel outlines").appendTo("body").append("<h3>OUTLINES</h3>");

	tests($panel);
	tests($outlines);
});