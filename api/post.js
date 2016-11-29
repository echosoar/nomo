"use strict";
const parse = require("co-body");
const setApiBodyData = require("./setApiBodyData.js");

let Post = function *(next){
	let data = yield parse(this);
	var url = this.url.split("/");
	url = url.slice(2);
	var that = this;
	switch(url[0]){
		case 'setApiBodyData':
			setApiBodyData(that, data);
			break;
	}
	yield next;
}

module.exports = Post;
