"use strict";
const http = require("http");
const Open = require("open");
const Koa = require("koa");
const Router = require("koa-router");
const Page = require("./page/")
const Api = require("./api/")

var router = new Router()
var app = Koa();

router.get("/",Page);

router.get("/api/*",Api);

app.use(router.middleware());

let nomo = (port) => {
	port = port || 1314;
	
	var server = http.createServer().listen(80);

	server.on('listening', function () {
		server.close();
		app.listen(port);
		Open("http://127.0.0.1:"+port+"/");
		console.log("==================");
		console.log(" Thanks use nomo! ");
		console.log("==================");
	});
	server.on('error', function (err) {
		if (err.code === 'EADDRINUSE') { // 端口已经被使用
			console.log("=========================");
			console.log(" Nomo start error: \n");
			console.log(" Port "+port+" is occupied! ");
			console.log("=========================");
		}
	});
}

module.exports = {
	start: nomo,
	nomo: nomo
}