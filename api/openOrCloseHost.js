"use strict";

const path = require("path");
const fs = require("fs");


const base = require("./base.js");

let openOrCloseHost = obj => {
	var host = /\?host=(.*?)(?:&|$)/.exec(obj.url);
	var res = base.hostStatus(host[1]);
	obj.body = JSON.stringify({res:res});
}

module.exports = openOrCloseHost;