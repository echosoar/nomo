"use strict";

const path = require("path");
const fs = require("fs");
const qs = require("querystring");

let getApiInfoBody = obj => {
	let data = qs.parse(obj.url.replace(/^(.*?)\?/,""));
	let host = data.host;
	let isHttps = data.isHttps;
	let api = data.api;

	var dirname = path.resolve(__dirname, "../data/"+(new Buffer(host)).toString('base64'));
	var apiFile = dirname+"/"+api+"/config.json";

	obj.body = fs.readFileSync(apiFile);
	
}
module.exports = getApiInfoBody;