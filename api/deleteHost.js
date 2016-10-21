"use strict";

const base = require("./base.js");

let main = function(obj){
	var nowHost = /\?host=(.*?)(?:&|$)/.exec(obj.url);
	if(!nowHost[1]){
		obj.body = JSON.stringify({res:0});
		return;
	}
	base.deleteHost(nowHost[1]);
	var dirname = __dirname+"/../data/"+(new Buffer(nowHost)).toString('base64');
	base.deleteFolder(dirname);
	obj.body = JSON.stringify({res:1});
}

module.exports = main;