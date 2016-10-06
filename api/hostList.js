"use strict";

const fs = require("fs");

const hostWINXP = "C:/Windows/System32/drivers/etc/hosts";

let main = function(obj){
	
	if(fs.existsSync(hostWINXP)){
		let hostFile = fs.readFileSync(hostWINXP).toString();
		
		var lineArr = hostFile.split("\r\n");
		var nomoHostBool = false;
		var nomoHost = [];
		for(var i = 0;i<lineArr.length;i++){
			if(lineArr[i] == "# NOMO HOST"){
				nomoHostBool = true;
			}else if(lineArr[i] == "# NOMO HOST END"){
				nomoHostBool = false;
			}else if(nomoHostBool){
				let temHost = lineArr[i].split(/\s/);
				if(temHost[1])
					nomoHost.push(temHost[1]);
			}
		}
		
		obj.body = JSON.stringify({num:nomoHost.length,data:nomoHost});
	}
}

module.exports = main;