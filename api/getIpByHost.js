"use strict";
const fs = require("fs");
const getIp = require("./hostToIp.js").hti;
const base = require("./base.js");
let main = function(obj){
	var nowHost = /\?host=(.*?)(?:&|$)/.exec(obj.url);
	if(!nowHost[1]){
		obj.body = JSON.stringify({res:0});
		return;
	}
	nowHost = nowHost[1].replace(/(^\s*)|(\s*$)/g,"");
	base.deleteHost(nowHost);
	var ip = getIp(nowHost);
	base.addHost(nowHost);
	/*var dirname = __dirname+"/../data/"+(new Buffer(nowHost)).toString('base64');
	var configFile = dirname+"/config.json";
	if(fs.existsSync(configFile)){
		let hostFile = fs.readFileSync(configFile).toString();
		let config = JSON.parse(hostFile);
		config.ip = getIp(nowHost);
	}*/
	obj.body = JSON.stringify({res:1,ip:ip});
}
module.exports = main;