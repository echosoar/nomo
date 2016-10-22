"use strict";

var fs = require("fs");
var http = require('http');
var request = require('request'); 

let Proxy = (req,res) => {
		
		let host = req.headers.host.toLowerCase();
		
		let hostReg = new RegExp("^http://"+host);
		
		let url = req.url.replace(hostReg,"");
		
		let api = url.replace(/\?(.*)$/,"");
		
		var dirname = __dirname+"/../data/"+(new Buffer(host)).toString('base64');
		var configFile = dirname + "/config.json";
		var apiFile = dirname+"/"+(new Buffer(api)).toString('base64')+".json";
		if(fs.existsSync(configFile)){
			var config = JSON.parse(fs.readFileSync(configFile).toString());
			
			if(fs.existsSync(apiFile)){
				var apiConfig = JSON.parse(fs.readFileSync(apiFile).toString());
			}else{
				console.log('[ -- Normal Request -- ]:','http://'+host+url);
				url = 'http://'+config.ip+url;
				var options = {
					url: url,
					headers: {"Host":host,"Cookie":req.headers.cookie}
				}; 
				
				function callback(error, response, body) { 
					res.writeHead(response.statusCode,response.headers);
					res.write(response.body);
					res.end();
				}
				
				request(options,callback);
			}
		}else{
			url = 'http://'+host+url;
			var options = {
				url: url,
				headers: req.headers
			}; 

			function callback(error, response, body) { 
				res.writeHead(response.statusCode,response.headers);
				res.write(response.body);
				res.end();
			}
				
			request(options,callback);
		}
}

module.exports = Proxy;
