"use strict";
const fs = require("fs");
const path = require("path");
const getIp = require("./hostToIp.js").hti;
const base = require("./base.js");
let main = function(obj){
	var nowHost = /\?host=(.*?)(?:&|$)/.exec(obj.url);
	if(!nowHost[1]){
		obj.body = JSON.stringify({res:0});
		return;
	}
	nowHost = nowHost[1].replace(/(^\s*)|(\s*$)/g,"");
	nowHost = nowHost.toLowerCase();
	base.deleteHost(nowHost, true);
	var ip = getIp(nowHost);
	base.addHost(nowHost);
	var dirname = path.resolve(__dirname, "../data/"+(new Buffer(nowHost)).toString('base64'));
	var configFile = dirname+"/config.json";
	if(fs.existsSync(configFile)){
		let hostFile = fs.readFileSync(configFile).toString();
		let config = JSON.parse(hostFile);
		config.ip = ip;
		fs.writeFileSync(configFile,JSON.stringify(config));
	}
	obj.body = JSON.stringify({res:1,ip:ip});
}
module.exports = main;