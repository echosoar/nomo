"use strict";

const path = require("path");
const fs = require("fs");

let addNewApi = obj => {
	var $_GET = /\?host=(.*?)&https=(.*?)&api=(.*?)$/.exec(obj.url);
	var nowHost = $_GET[1];
	var isHttps = $_GET[2]=="true";
	var api = $_GET[3];
	var apiName = (new Buffer((isHttps?'https#nomo#':'http#nomo#') + api)).toString('base64');
	var dirname = path.resolve(__dirname, "../data/"+(new Buffer(nowHost)).toString('base64'));
	var configFile = dirname+"/config.json";
	var apiFile = dirname+"/"+apiName+".json";
	var config = JSON.parse(fs.readFileSync(configFile));
	var addRes = false;
	if(!config.api[apiName]){
		config.api[apiName] = {
			name:api,
			isHttps:isHttps
		}
		addRes = true;
		fs.writeFileSync(apiFile,JSON.stringify({
			returnMode: 'fixed',
			returnConfig: {
				mode: 'string',
				value: 'Thanks use nomo!'
			}
		}));
		fs.writeFileSync(configFile,JSON.stringify(config));
	}
	obj.body = JSON.stringify({res:addRes?1:0});
}

module.exports = addNewApi;