"use strict";

const fs = require("fs");

let index = function * (next){

	let url = this.request.url.replace("/nomo","");
	if(!url||url=="/")url="/index.html";
	
	let ext = url.split(".").pop();
	
	let contentType = {
		"html":"text/html",
		"css":"text/css",
		"js":"application/x-javascript",
		"png":"image/png",
		"gif":"image/gif"
	}
	
	let fileType = contentType[ext] || "text/plain";
	
	this.response.type = fileType + '; charset=utf-8';
	
	let fileAddr = __dirname + url;
	
	if(fs.existsSync(fileAddr)) this.body = fs.readFileSync(fileAddr);
	else this.body = '404 Nomo Not Found!';
	
	yield next;
}

module.exports = index;