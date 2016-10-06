"use strict";

const fs = require("fs");

let index = function * (next){
	this.response.type = 'text/html; charset=utf-8';
	this.body = fs.readFileSync(__dirname + "/index.html");
	yield next;
}

module.exports = index;