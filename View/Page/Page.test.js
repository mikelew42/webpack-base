// require("../jasmine");

var Page = require("./Page")
var $ = require("jquery");

$(function(){
	var page = Page({
		$container: $("body")
	});
});