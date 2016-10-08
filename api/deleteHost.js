"use strict";

const fs = require("fs");

const hostWINXP = "C:/Windows/System32/drivers/etc/hosts";

let deleteFolderRecursive = function(path) {

    var files = [];

    if( fs.existsSync(path) ) {

        files = fs.readdirSync(path);

        files.forEach(function(file,index){

            var curPath = path + "/" + file;

            if(fs.statSync(curPath).isDirectory()) { // recurse

                deleteFolderRecursive(curPath);

            } else { // delete file

                fs.unlinkSync(curPath);

            }

        });

        fs.rmdirSync(path);

    }

};


let main = function(obj){
	
	if(fs.existsSync(hostWINXP)){
		let hostFile = fs.readFileSync(hostWINXP).toString();
		
		var lineArr = hostFile.split("\r\n");
		var resHost = [];
		var nomoHostBool = false;
		var nowHost = /\?host=(.*?)(?:&|$)/.exec(obj.url);
		if(!nowHost[1]){
			obj.body = JSON.stringify({res:0});
			return;
		}
		nowHost = nowHost[1].replace(/(^\s*)|(\s*$)/g,"");
		for(var i = 0;i<lineArr.length;i++){
			
			if(lineArr[i] == "# NOMO HOST"){
				nomoHostBool = true;
			
			}else if(lineArr[i] == "# NOMO HOST END"){
				nomoHostBool = false;
			}else if(nomoHostBool){
				let temHost = lineArr[i].split(/\s/);
				if(temHost[1]==nowHost){
					var dirname = __dirname+"/../data/"+(new Buffer(nowHost)).toString('base64');
					deleteFolderRecursive(dirname)
					continue;
				}
			}
			resHost.push(lineArr[i]);
		}
		
		fs.writeFileSync(hostWINXP, resHost.join("\r\n"));
		obj.body = JSON.stringify({res:1});
	}
}

module.exports = main;