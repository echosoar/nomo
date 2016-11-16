"use strict";

const path = require("path");

let addNewApi = obj => {
	var $_GET = /\?host=(.*?)&https=(.*?)&api=(.*?)$/.exec(obj.url);
	var nowHost = $_GET[1];
	var dirname = path.resolve(__dirname, "../data/"+(new Buffer(nowHost)).toString('base64'));
	var configFile = dirname+"/config.json";
}

module.exports = addNewApi;