"use strict";
var fs = require("fs");
var path = require("path");
var https = require('https');
var request = require('request'); 
var isBinary = require('./isBinary.js');

let Proxys = () => {
		
	console.log("\n==================\n Nomo proxy https request need setting chrome HSTS\n Please open page ‘chrome://net-internals/#hsts’ at chrome\n And delete domain that you bind at nomo! \n==================\n");
	
	let option = {
		key: fs.readFileSync(__dirname + '/../ssl/nomo-key.pem', 'utf8'),
		cert: fs.readFileSync(__dirname + '/../ssl/nomo-crt.pem', 'utf8'),
		passphrase: '123456'
	}
	let server = https.createServer(option, (req, res)=>{
		
		let host = req.headers.host.toLowerCase();

		let hostReg = new RegExp("^https://"+host);
		
		let url = req.url.replace(hostReg,"");
		
		let api = url.replace(/\?(.*)$/,"");
		
		var dirname = path.resolve(__dirname, "../data/"+(new Buffer(host)).toString('base64'));
		var configFile = dirname + "/config.json";
		var apiFile = dirname+"/"+(new Buffer('https#nomo#'+api)).toString('base64')+".json";
		
		if(fs.existsSync(configFile)){
			var config = JSON.parse(fs.readFileSync(configFile).toString());
			
			if(fs.existsSync(apiFile)){
				var apiConfig = JSON.parse(fs.readFileSync(apiFile).toString());
				res.writeHead("200",{"Content-Type":"text/html"});
				res.write("Nomo Success!");
				res.end();
				
			}else{
				console.log('[ -- Normal HTTPS Request -- ]:','https://'+host+url);
				url = 'https://'+config.ip+url;
				var options = {
					url: url,
					headers: {"Host":host}
				}; 
				
				request(options,(error, response, body) => { 
					if(error!=null){
						res.writeHead("200",{"Content-Type":"text/html"});
						res.write("Nomo Error!<br />May be host not bind ip address.");
						res.end();
					}else{
						if(isBinary(response.headers["content-type"])){
							var options = {
								url: response.request.href,
								headers: {"Host":host},
								encoding: 'binary'
							};
							request(options,(error,responseBinary)=>{
								if(error==null){
									res.writeHead(responseBinary.statusCode, responseBinary.headers);
									res.write(responseBinary.body, "binary");
									res.end();
								}
							});
						}else{
							res.writeHead(response.statusCode,response.headers);
							res.write(response.body);
							res.end();
						}
					}
				});
			}
		}else{
			res.writeHead(200, {"Content-Type":"text/html"});
			res.write("Nomo config error!");
			res.end();
		}
	}).listen(443);
}
module.exports = Proxys;



