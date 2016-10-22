"use strict";
const fs = require("fs");
let main = obj => {

	var ips = /\?ip=(.*?)&host=(.*?)$/.exec(obj.url);
	if(!ips){
		obj.body = JSON.stringify({res:0});
		return;
	}
	var ip = ips[1].replace(/(^\s*)|(\s*$)/g,"");
	var nowHost = ips[2].replace(/(^\s*)|(\s*$)/g,"");
	nowHost = nowHost.toLowerCase();
	var dirname = __dirname+"/../data/"+(new Buffer(nowHost)).toString('base64');
	var configFile = dirname+"/config.json";
	if(fs.existsSync(configFile)){
		let hostFile = fs.readFileSync(configFile).toString();
		let config = JSON.parse(hostFile);
		config.ip = ip;
		fs.writeFileSync(configFile,JSON.stringify(config));
		obj.body = JSON.stringify({res:1,ip:ip});
	}else{
		obj.body = JSON.stringify({res:0});
	}
}

module.exports = main;