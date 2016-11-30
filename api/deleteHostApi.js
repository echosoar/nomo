"use strict";

const path = require("path");
const fs = require("fs");
const base = require("./base.js");

let main = function(obj){
	var $_GET = /\?host=(.*?)&api=(.*?)$/.exec(obj.url);
	var host = $_GET[1];
	var api = $_GET[2];
	
	var dirname = path.resolve(__dirname, "../data/"+(new Buffer(host)).toString('base64'));
	var configFile = dirname+"/config.json";
	var apiFile = dirname+"/"+api+"/";
	
	var config = JSON.parse(fs.readFileSync(configFile));
	
	delete config.api[api];
	
	fs.writeFileSync(configFile,JSON.stringify(config));
	
	base.deleteFolder(apiFile);
	
	obj.body = JSON.stringify({res:1});
}

module.exports = main;