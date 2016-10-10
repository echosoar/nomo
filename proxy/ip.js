"use strict";
var shellOrCmd = require('child_process').spawn;
var execRes = shellOrCmd('ping', ['iwenku.net']);
var ipRes = false;
var ip = "";
execRes.stdout.on('data', function (data) { 
	let ipReg = /(\d{1,3}\.){3}\d{1,3}/;
	if(!ipRes && ipReg.test(data)){
		ipRes = true;
		ip = ipReg.exec(data)[0];
		console.log(ip);
	}
});




