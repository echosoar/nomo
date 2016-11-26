"use strict";

let fs = require("fs");
let path = require("path");

const hostList = require("./hostList.js");
const addNewHost = require("./addNewHost.js");
const deleteHost = require("./deleteHost.js");
const getIpByHost = require("./getIpByHost.js");
const getConfigByHost = require("./getConfigByHost.js");
const setHostIp = require("./setHostIp.js");
const addNewApi = require("./addNewApi.js");
const openOrCloseHost = require("./openOrCloseHost.js");
const deleteHostApi = require("./deleteHostApi.js");

(function(){
	let dataDir = path.resolve(__dirname, "../data/");
	if(!fs.existsSync(dataDir)){
		fs.mkdirSync(dataDir);
	}
}());


let index = function * (next){
	var url = this.url.split("/");
	url = url.slice(2);
	var that = this;
	switch(url[0]){
		case "hostList":
			hostList(that);
			break;
		case "addNewHost":
			addNewHost(that);
			break;
		case "deleteHost":
			deleteHost(that);
			break;
		case "getIpByHost":
			getIpByHost(that);
			break;
		case "getConfigByHost":
			getConfigByHost(that);
			break;
		case "setHostIp":
			setHostIp(that);
			break;
		case "addNewApi":
			addNewApi(that);
			break;
		case 'openOrCloseHost':
			openOrCloseHost(that);
			break;
		case 'deleteHostApi':
			deleteHostApi(that);
			break;
	}
	yield next;
}

module.exports = index;