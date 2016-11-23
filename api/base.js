"use strict";

const fs = require("fs");
const path = require("path");
const hostWINXP = "C:/Windows/System32/drivers/etc/hosts";
const hostOSX = "/etc/hosts";


let mkFolder = dirname => {
	if(!fs.existsSync(dirname)){
		fs.mkdirSync(dirname);
	}
}

let deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};


let deleteHost = host => {
	host = host.toLowerCase();
	let hostFileOpen = false;
	let hostFile;
	let hostFileAddr;
	if(fs.existsSync(hostWINXP)){
		hostFile = fs.readFileSync(hostWINXP).toString();
		hostFileOpen = true;
		hostFileAddr = hostWINXP;
	}
	if(fs.existsSync(hostOSX)){
		hostFile = fs.readFileSync(hostOSX).toString();
		hostFileOpen = true;
		hostFileAddr = hostOSX;
	}
	if(hostFileOpen){
		var lineArr = hostFile.split("\r\n");
		var resHost = [];
		var nomoHostBool = false;	
		for(var i = 0;i<lineArr.length;i++){
			if(lineArr[i] == "# NOMO HOST"){
				nomoHostBool = true;
			}else if(lineArr[i] == "# NOMO HOST END"){
				nomoHostBool = false;
			}else if(nomoHostBool){
				let temHost = lineArr[i].split(/\s/);
				if(temHost[1]==host || (temHost[0]=="#" && temHost[2]==host)){
					let hostDirName = path.resolve(__dirname, "../data/"+(new Buffer(host)).toString('base64'));
					deleteFolderRecursive(hostDirName);
					continue;
				}
			}
			resHost.push(lineArr[i]);
		}

		fs.writeFileSync(hostFileAddr, resHost.join("\r\n"));
		hostFileOpen = false;
		return true;
	}
	return false;
}

let addHost = host => {
	host = host.toLowerCase();
	let hostFileOpen = false;
	let hostFile;
	let hostFileAddr;
	if(fs.existsSync(hostWINXP)){
		hostFile = fs.readFileSync(hostWINXP).toString();
		hostFileOpen = true;
		hostFileAddr = hostWINXP;
	}
	if(fs.existsSync(hostOSX)){
		hostFile = fs.readFileSync(hostOSX).toString();
		hostFileOpen = true;
		hostFileAddr = hostOSX;
	}
	if(hostFileOpen){
		var lineArr = hostFile.split("\r\n");
		var resHost = [];
		var nomoHostBool = false;
		var nomoAdded = false;
		var isHostExist = false;
		for(var i = 0;i<lineArr.length;i++){
			if(lineArr[i] == "# NOMO HOST"){
				nomoHostBool = true;
				nomoAdded = true;
			}else if(lineArr[i] == "# NOMO HOST END"){
				nomoHostBool = false;
				if(!isHostExist){
					resHost.push("127.0.0.1 "+host);
				}
			}else if(nomoHostBool){
				let temHost = lineArr[i].split(/\s/);
				if(temHost[1]==host||(temHost[0]=="#" && temHost[2]==host)){
					isHostExist = true;
					return true;
				}
			}
			resHost.push(lineArr[i]);
		}
		
		if(!nomoAdded){
			resHost.push("# NOMO HOST", "127.0.0.1 "+host, "# NOMO HOST END");
		}

		fs.writeFileSync(hostFileAddr, resHost.join("\r\n"));
		hostFileOpen = false;
		return true;
	}
	return false;
}

let hostStatus = host => {
	host = host.toLowerCase();
	let hostFileOpen = false;
	let hostFile;
	let hostFileAddr;
	let nowStatus = false;
	if(fs.existsSync(hostWINXP)){
		hostFile = fs.readFileSync(hostWINXP).toString();
		hostFileOpen = true;
		hostFileAddr = hostWINXP;
	}
	if(fs.existsSync(hostOSX)){
		hostFile = fs.readFileSync(hostOSX).toString();
		hostFileOpen = true;
		hostFileAddr = hostOSX;
	}
	if(hostFileOpen){
		var lineArr = hostFile.split("\r\n");
		var resHost = [];
		var nomoHostBool = false;	
		for(var i = 0;i<lineArr.length;i++){
			if(lineArr[i] == "# NOMO HOST"){
				nomoHostBool = true;
			}else if(lineArr[i] == "# NOMO HOST END"){
				nomoHostBool = false;
			}else if(nomoHostBool){
				let temHost = lineArr[i].split(/\s/);
				if(temHost[1]==host || (temHost[0]=="#" && temHost[2]==host)){
					if(temHost[0]=="#"){
						lineArr[i] = "127.0.0.1 "+host;
						nowStatus = true;
					}else{
						lineArr[i] = "# 127.0.0.1 "+host;
						nowStatus = false;
					}
				}
			}
			resHost.push(lineArr[i]);
		}

		fs.writeFileSync(hostFileAddr, resHost.join("\r\n"));
		hostFileOpen = false;
		return nowStatus;
	}
	return nowStatus;
}

module.exports = {
	deleteHost : deleteHost,
	deleteFolder : deleteFolderRecursive,
	mkFolder : mkFolder,
	addHost : addHost,
	hostStatus: hostStatus
}