"use strict";

const fs = require("fs");

const hostWINXP = "C:/Windows/System32/drivers/etc/hosts";

let main = function(obj){
	
	if(fs.existsSync(hostWINXP)){
		let hostFile = fs.readFileSync(hostWINXP).toString();
		
		var lineArr = hostFile.split("\r\n");
		var resHost = [];
		var nomoHostBool = false;
		var nomoAdded = false;
		var nomoHost = [];
		var newHost = /\?host=(.*?)(?:&|$)/.exec(obj.url);
		var isHostExist = false;
		if(!newHost[1]){
			obj.body = JSON.stringify({res:0});
			return;
		}
		newHost = newHost[1];
		for(var i = 0;i<lineArr.length;i++){
			
			if(lineArr[i] == "# NOMO HOST"){
				nomoHostBool = true;
				nomoAdded = true;
			}else if(lineArr[i] == "# NOMO HOST END"){
				nomoHostBool = false;
				if(!isHostExist)resHost.push("127.0.0.1 "+newHost);
			}else if(nomoHostBool){
				let temHost = lineArr[i].split(/\s/);
				if(temHost[1]==newHost){
					isHostExist = true;
					obj.body = JSON.stringify({res:2});
					return;
				}
			}
			resHost.push(lineArr[i]);
		}
		if(!nomoAdded){
			resHost.push("# NOMO HOST");
			resHost.push("127.0.0.1 "+newHost);
			resHost.push("# NOMO HOST END");
		}
		fs.writeFileSync(hostWINXP, resHost.join("\r\n"));
		obj.body = JSON.stringify({res:1});
	}
}

module.exports = main;