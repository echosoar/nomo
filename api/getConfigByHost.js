"use strict";

const fs = require("fs");
const getIp = require("./hostToIp.js").hti;
const base = require("./base.js");

let main = obj => {
	var nowHost = /\?host=(.*?)(?:&|$)/.exec(obj.url);
	if(!nowHost[1]){
		obj.body = JSON.stringify({res:0});
		return;
	}
	nowHost = nowHost[1];
	nowHost = nowHost.toLowerCase();
	var dirname = __dirname+"/../data/"+(new Buffer(nowHost)).toString('base64');
	var configFile = dirname+"/config.json";
	var configJson = {};
	if(!fs.existsSync(configFile)){
		var config = {};
		config.host = nowHost;
		base.deleteHost(nowHost);
		config.ip = getIp(nowHost);
		base.addHost(nowHost);
		config.api = [];
		configJson = config;
		fs.writeFileSync(configFile,JSON.stringify(configJson));
	}else{
		configJson = JSON.parse(fs.readFileSync(configFile).toString());
	}
	obj.body = JSON.stringify({res:1,config:configJson});
}

module.exports = main;