"use strict";

console.log(" ==================\n ");
console.log(" Thanks use Nomo ");


const http = require("http");
const Open = require("open");
const Koa = require("koa");
const Router = require("koa-router");
const Page = require("./page/");
const Api = require("./api/");
const Post = require("./api/post.js");
const Proxy = require("./proxy");

var router = new Router()
var app = Koa();

router.get("/api/*", Api);
router.get("/nomo/*",Page);
router.post("/post/*",Post);



app.use(router.middleware());

let nomo = (port) => {
	port = port || 1314;
	
	var server = http.createServer(function(req,res){
		Proxy(req,res);
	}).listen(80);
	

	server.on('listening', function () {
		
		app.listen(port);
		Open("http://127.0.0.1:"+port+"/nomo/");

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