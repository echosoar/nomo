"use strict";
var http = require('http');

var server = http.createServer().listen(80);

server.on("error",function(err){
	console.log("error",err)
});