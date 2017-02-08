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
var ProxyHttps = require("./proxy/https.js");



var router = new Router()
var app = Koa();

router.get("/api/*", Api);
router.get("/nomo/*",Page);
router.post("/post/*",Post);



app.use(router.middleware());

let nomo = (port, option) => {
	if(!port || typeof port == 'number') {
		port = port || 1314;
	}
	option = option || {}
	option.http = option.http || 80;
	option.https = option.https || 443;
	
	var server = http.createServer(function(req,res){
		Proxy(req,res);
	}).listen(option.http);
	ProxyHttps(option.https);
	

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

let nomoMid = (req, res) => {
	console.log("nomo middleware")
}

module.exports = {
	start: nomo,
	nomo: nomo,
	mid: nomoMid
}