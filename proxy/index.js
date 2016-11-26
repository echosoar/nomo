"use strict";

var fs = require("fs");
var path = require("path");
var http = require('http');
var request = require('request'); 
var isBinary = require('./isBinary.js');
var https = require("./https.js");

https();

let Proxy = (req,res) => {

		let host = req.headers.host.toLowerCase();
		
		let hostReg = new RegExp("^http://"+host);
		
		let url = req.url.replace(hostReg,"");
		
		let api = url.replace(/\?(.*)$/,"");
		
		var dirname = path.resolve(__dirname, "../data/"+(new Buffer(host)).toString('base64'));
		var configFile = dirname + "/config.json";
		var apiFile = dirname+"/"+(new Buffer('http#nomo#'+api)).toString('base64')+".json";
		
		
		var callback = (error, response, body) => { 
			if(error!=null){
				res.writeHead("200",{"Content-Type":"text/html"});
				res.write("Nomo Error!<br />May be host not bind ip address.");
				res.end();
			}else{
				if(isBinary(response.headers["content-type"])){
					var options = {
						url: response.request.href,
						headers: response.request.headers,
						encoding: 'binary'
					};
					request(options,(error,responseBinary)=>{
						res.writeHead(responseBinary.statusCode, responseBinary.headers);
						res.write(responseBinary.body, "binary");
						res.end();
					});
				}else{
					res.writeHead(response.statusCode,response.headers);
					res.write(response.body);
					res.end();
				}
			}
		}
		
		if(fs.existsSync(configFile)){
			var config = JSON.parse(fs.readFileSync(configFile).toString());
			
			if(fs.existsSync(apiFile)){
				var apiConfig = JSON.parse(fs.readFileSync(apiFile).toString());
				res.writeHead("200",{"Content-Type":"text/html"});
				res.write("Nomo Https Success!");
				res.end();
				
			}else{
				console.log('[ -- Normal Request -- ]:','http://'+host+url);
				url = 'http://'+config.ip+url;
				var options = {
					url: url,
					headers: {"Host":host,"Cookie":req.headers.cookie}
				}; 
				
				request(options,callback);
			}
		}else{
			res.writeHead(200, {"Content-Type":"text/html"});
			res.write("Nomo config error!");
			res.end();
		}
}

module.exports = Proxy;
