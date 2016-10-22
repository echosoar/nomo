"use strict";

const hostList = require("./hostList.js");
const addNewHost = require("./addNewHost.js");
const deleteHost = require("./deleteHost.js");
const getIpByHost = require("./getIpByHost.js");
const getConfigByHost = require("./getConfigByHost.js");
const setHostIp = require("./setHostIp.js");

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
	}
	yield next;
}

module.exports = index;