"use strict";

const path = require("path");
const fs = require("fs");
const qs = require("querystring");

let setApiBodyData = (obj, data) => {
	data = qs.parse(data);
	let host = data.host;
	let isHttps = data.isHttps;
	let api = data.api;
	let bodyData = data.bodyData;
	let returnMode = data.returnMode;
	var apiName = api;
	var dirname = path.resolve(__dirname, "../data/"+(new Buffer(host)).toString('base64'));
	var apiFile = dirname+"/"+apiName+"/config.json";
	var config = JSON.parse(fs.readFileSync(apiFile));
	
	var oldData = {
		changeTime:(new Date())-0,
		returnMode:config.returnMode,
		returnConfig: config.returnConfig
	}
	
	config.returnMode = returnMode;
	config.returnConfig = JSON.parse(bodyData);
	if(config.changeLog.length>5)config.changeLog.pop();
	config.changeLog.unshift(oldData);
	fs.writeFileSync(apiFile,JSON.stringify(config));
	obj.body = "success!";
	
}
module.exports = setApiBodyData;