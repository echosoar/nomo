"use strict";

const path = require("path");
const fs = require("fs");
const qs = require("querystring");
var base = require("./base.js");

let getDataPreview = obj => {
	let data = qs.parse(obj.url.replace(/^(.*?)\?/,""));
	let host = data.host;
	let isHttps = data.isHttps;
	let api = data.api;

	var dirname = path.resolve(__dirname, "../data/"+(new Buffer(host)).toString('base64'));
	var apiFile = dirname+"/"+api+"/config.json";
	
	var apiConfig = JSON.parse(fs.readFileSync(apiFile));
	
	var writeContent = "Nomo Success!";
	if(apiConfig.returnMode == "fixed"){
		writeContent = JSON.stringify(base.data_format_fixed(apiConfig.returnConfig));
	}
	
	obj.body = writeContent;
	
}
module.exports = getDataPreview;