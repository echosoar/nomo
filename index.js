"use strict";
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
	app.listen(port);
	Open("http://127.0.0.1:"+port+"/");
	console.log("=====================");
	console.log("   Thanks use nomo!  ");
	console.log("=====================");
}

module.exports = {
	start: nomo,
	nomo: nomo
}