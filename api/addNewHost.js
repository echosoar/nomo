"use strict";

const fs = require("fs");
const getIp = require("./hostToIp.js").hti;
const base = require("./base.js");

let main = function(obj){
	var newHost = /\?host=(.*?)(?:&|$)/.exec(obj.url);
	if(!newHost[1]){
		obj.body = JSON.stringify({res:0});
		return;
	}
	
	newHost = newHost[1];
	
	var dirname = __dirname+"/../data/"+(new Buffer(newHost)).toString('base64');
	base.mkFolder(dirname);
	
	var configFile = dirname+"/config.json";
	if(!fs.existsSync(configFile)){
		var config = {};
		config.host = newHost;
		config.ip = getIp(newHost);
		config.api = [];
		fs.writeFileSync(configFile,JSON.stringify(config));
	}
	var addRes = base.addHost(newHost);
	obj.body = JSON.stringify({res:addRes?1:0});
}

module.exports = main;