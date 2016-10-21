"use strict";

const base = require("./base.js");

let main = function(obj){
	var newHost = /\?host=(.*?)(?:&|$)/.exec(obj.url);
	if(!newHost[1]){
		obj.body = JSON.stringify({res:0});
		return;
	}
	
	var addRes = base.addHost(newHost[1]);
	
	var dirname = __dirname+"/../data/"+(new Buffer(newHost)).toString('base64');
	base.mkFolder(dirname);
	
	obj.body = JSON.stringify({res:addRes?1:0});
}

module.exports = main;