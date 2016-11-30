var isHttps = false;
var nowInfoBar = '';
var nowInfoConfig = {host:'',api:'',apiName:'',isHttps:false};

Date.prototype.format = function(format) {
       var date = {
              "M+": this.getMonth() + 1,
              "d+": this.getDate(),
              "h+": this.getHours(),
              "m+": this.getMinutes(),
              "s+": this.getSeconds(),
              "q+": Math.floor((this.getMonth() + 3) / 3),
              "S+": this.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in date) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
              }
       }
       return format;
}
	
var getXhr = function(){
	if(window.XMLHttpRequest){
		var xhr=new XMLHttpRequest();
	}else{
		try{
			var xhr=new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e){
			try{
				var xhr=new ActiveXObject("Microsoft.XMLHTTP");
			}catch(e){
				throw new TypeError('Unsupport XMLHttpRequest');
			}
		}
	}
	return xhr;
}
		
		function getHostList(){
			var xhr = getXhr();
			xhr.onreadystatechange = function(){
				if(xhr.readyState==4){
					if(xhr.status == 200){
						nodeStyle("host-list").innerHTML = "";
						nodeStyle("loading",{display:"none"});
						var data = JSON.parse(xhr.responseText);
						if(data.num>0){
							var fragment = document.createDocumentFragment("div");
							data.data.forEach(function(v,index){
								var temElement = document.createElement("div");
								temElement.setAttribute("id","host-list-item-"+index);
								temElement.setAttribute("class","host-list-item");
								temElement.innerHTML = v.host + '<div class="host-list-onOrOff host-list-onOrOff-'+(v.isOpen?'on':'off')+'"><i class="host-list-onOrOff-i"></i></div><i class="host-list-api btn-circle" id="host-list-api-'+index+'">Api</i><i class="host-list-del btn-circle" id="host-list-del-'+index+'">Del</i>';
								fragment.appendChild(temElement);
							});
							
							nodeStyle("host-list").appendChild(fragment);
						}else{
							var temElement = document.createElement("div");
							temElement.setAttribute("class","host-list-noitem");
							temElement.innerHTML = "No Host Bind Now!";
							nodeStyle("host-list").appendChild(temElement);
						}
					}
				}
			}
			xhr.open("GET","/api/hostList");
			xhr.send(null);
		}
		
		function nodeStyle(element,style){
			element = document.getElementById(element);
			if(style){
				for(var i in style){
					element.style[i]=style[i];
				}
			}
			return element;
		}
		
		
		function getConfig(host){
			nodeStyle("api-info-ip").innerHTML = "Loading IP Address";
			var xhr = getXhr();
			xhr.open("GET","/api/getConfigByHost/?host="+host);
			xhr.onreadystatechange = function(){
				if(xhr.readyState==4){
					if(xhr.status == 200){
						var data = JSON.parse(xhr.responseText);
						
						if(data.res==1 && data.config.ip!=false){
							nodeStyle("api-info-ip").innerHTML = data.config.ip;
						}else{
							nodeStyle("api-info-ip").innerHTML ="Can not get ip , please manually set!";
						}
						
						nodeStyle("api-info-setip",{display:"block"});
						nodeStyle("api-info-regetip",{display:"block"});
						
						listApi(data.config.api);
					}
				}
			}
			xhr.send(null);
		}
		
		function listApi(api){
			var html = "";
			for(var key in api){
				var item = api[key];
				html += '<div class="api-list-item api-list-item-'+(item.isHttps?'https':'http')+'" id="api-list-item-'+key+'">'+item.name+'<i class="api-list-info btn-circle" id="api-list-info-'+key+'">Info</i><i class="api-list-del btn-circle" id="api-list-del-'+key+'">Del</i></div>';
			}
			nodeStyle("api-item-list").innerHTML = html;
		}
		
		function getIp(host){
			var xhr = getXhr();
			xhr.open("GET","/api/getIpByHost/?host="+host);
			xhr.onreadystatechange = function(){
				if(xhr.readyState==4){
					if(xhr.status == 200){
						var data = JSON.parse(xhr.responseText);
						if(data.res==1 && data.ip!=false){
							nodeStyle("api-info-ip").innerHTML = data.ip;
						}else{
							nodeStyle("api-info-ip").innerHTML ="Can not get ip , please manually set!";
						}
						nodeStyle("api-info-setip",{display:"block"});
						nodeStyle("api-info-regetip",{display:"block"});
					}
				}
			}
			xhr.send(null);
		}
		
		
		function openApiInfo(host, api, apiName, isHttps){
			nowInfoConfig = {
				host: host,
				api: api,
				apiName: apiName,
				isHttps: isHttps
			}
			nodeStyle("api",{display:"none"});
			nodeStyle("info",{display:"block"});
			nodeStyle("title-info-api").innerHTML = (isHttps?'https':'http') + '://' + host + apiName;
			nodeStyle("title-info-api").setAttribute("class",host);
		}
		
	
		setTimeout(function(){
			nodeStyle("welcome",{"height":"60px","fontSize":"20px","backgroundColor":"#9c9"});
			getHostList();
		},0);
		
		document.getElementById("add-new-host").onclick = function(){
			nodeStyle("add-new-form",{display:"block"});
			nodeStyle("loading",{display:"none"});
		}
		document.getElementById("add-new-cancel").onclick = function(){
			nodeStyle("add-new-address").value = "";
			nodeStyle("add-new-form",{display:"none"});
		}
		document.getElementById("add-new-ok").onclick = function(){
			var address = nodeStyle("add-new-address").value.replace(/\s/g,"");
			if(!address)return;
			nodeStyle("add-new-form",{display:"none"});
			nodeStyle("loading",{display:"block"});
			
			var xhr = getXhr();
			xhr.onreadystatechange = function(){
				if(xhr.readyState==4){
					if(xhr.status == 200){
						nodeStyle("loading",{display:"none"});
						var data = JSON.parse(xhr.responseText);
						console.log(data);
						if(data.res>0){
							getHostList();
						}
					}
				}
			}
			xhr.open("GET","/api/addNewHost/?host="+address);
			xhr.send(null);
		}
		
		document.body.onclick = function(e){
			e = e || window.e;
			var target = e.target || e.srcElement;
			
			if(target.className.indexOf('host-list-del')!=-1 && target.innerHTML == "Del" && confirm("Do you really want to delete this one?")){
				var id = target.getAttribute("id").split("-").pop();
				var preHTML = target.parentNode.innerHTML;
				var host = preHTML.split("<")[0];
				target.parentNode.innerHTML = "Deleting...";
				
				var xhr = getXhr();
				xhr.onreadystatechange = function(){
					if(xhr.readyState==4){
						if(xhr.status == 200){
							getHostList();
						}
					}
				}
				xhr.open("GET","/api/deleteHost/?host="+host);
				xhr.send(null);
			}else if(target.className.indexOf('api-list-del')!=-1 && target.innerHTML == "Del" && confirm("Do you really want to delete this api?")){
				var apiName = target.getAttribute("id").split("-").pop();
				var host = nodeStyle("title-api-host").innerHTML;
				target.parentNode.innerHTML = "Deleting...";
				var xhr = getXhr();
				xhr.onreadystatechange = function(){
					if(xhr.readyState==4){
						if(xhr.status == 200){
							nodeStyle("api-item-list").removeChild(nodeStyle("api-list-item-"+apiName));
						}
					}
				}
				xhr.open("GET","/api/deleteHostApi/?host="+host+"&api="+apiName);
				xhr.send(null);
			}else if(target.innerHTML == "Api"){
				var host = target.parentNode.innerHTML.split("<")[0];
				nodeStyle("main",{display:"none"});
				nodeStyle("add-new-api-form",{display:"none"});
				nodeStyle("api",{display:"block"});
				nodeStyle("title-api-host").innerHTML= host;
				getConfig(host);
			}else if(target.innerHTML == "Info"){
				var api = target.getAttribute("id").split("-").pop();
				var host = nodeStyle("title-api-host").innerHTML;
				var apiName = target.parentNode.innerHTML.replace(/<i class=\".*$/,"");
				var isHttps = target.parentNode.className.indexOf('api-list-item-https')!=-1;
				openApiInfo(host, api, apiName, isHttps);
				changeInfoBar("body");
			}else if(target.className.indexOf("host-list-onOrOff")!=-1){
				if(target.nodeName.toLowerCase()=="i") target = target.parentNode;
				console.log(target.childNodes);
				target.childNodes[0].innerHTML = "wait";
				var preHTML = target.parentNode.innerHTML;
				var host = preHTML.split("<")[0];
				var xhr = getXhr();
				xhr.onreadystatechange = function(){
					if(xhr.readyState==4){
						if(xhr.status == 200){
							target.childNodes[0].innerHTML = "";
							let res = JSON.parse(xhr.responseText);
							if(res.res){
								target.className = "host-list-onOrOff host-list-onOrOff-on";
							}else{
								target.className = "host-list-onOrOff host-list-onOrOff-off";
							}
						}
					}
				}
				xhr.open("GET","/api/openOrCloseHost/?host="+host);
				xhr.send(null);
			}
		}
		
		nodeStyle("return-to-host-list").onclick = function(){
			nodeStyle("api",{display:"none"});
			nodeStyle("main",{display:"block"});
			nodeStyle("api-info-regetip",{display:"none"});
			nodeStyle("api-info-setip",{display:"none"});
		}
		
		function infoClose(){
			nodeStyle("info-contain-"+nowInfoBar).removeAttribute("class");
			nodeStyle("info-main-"+nowInfoBar).style.display = "none";
			nowInfoBar = "";
		}
		
		nodeStyle("return-to-api-list").onclick = function(){
			nodeStyle("info",{display:"none"});
			getConfig(nodeStyle("title-info-api").className);
			nodeStyle("api",{display:"block"});
			infoClose();
		}
		
		nodeStyle("api-info-regetip").onclick = function(){
			nodeStyle("api-info-ip").innerHTML = "Loading IP Address";
			nodeStyle("api-info-regetip",{display:"none"});
			nodeStyle("api-info-setip",{display:"none"});
			var host = nodeStyle("title-api-host").innerHTML;
			getIp(host);
		}
		nodeStyle("api-info-setip").onclick = function(){
			var host = nodeStyle("title-api-host").innerHTML;
			var res = prompt("Please Input Ip Address","");
			
			if(/(\d{1,3}\.){3}\d{1,3}/.test(res)){
				
				var xhr = getXhr();
				xhr.open("GET","/api/setHostIp/?ip="+res+"&host="+host);
				xhr.onreadystatechange = function(){
					if(xhr.readyState==4){
						if(xhr.status == 200){
							var data = JSON.parse(xhr.responseText);
							if(data.res==1){
								nodeStyle("api-info-ip").innerHTML = data.ip;
							}else{
								nodeStyle("api-info-ip").innerHTML = "IP Address Set Error!";
							}
						}
					}
				}
				xhr.send(null);
				
			}else if(res != null){
				alert("Ip Address Format Error!");
			}
		}
		
		nodeStyle("add-new-api").onclick = function(){
			nodeStyle("add-new-api-form",{display:"block"});
		}
		
		nodeStyle("add-new-api-isHttp").onclick = function(){
			if(!isHttps){
				isHttps = true;
				nodeStyle("add-new-api-isHttp").className = "add-new-api-isHttps";
				nodeStyle("add-new-api-isHttp-btn").className = "add-new-api-isHttp-btnHttps";
			}else{
				isHttps = false;
				nodeStyle("add-new-api-isHttp").className = "add-new-api-isHttp";
				nodeStyle("add-new-api-isHttp-btn").className = "add-new-api-isHttp-btnHttp";
			}
		}
		nodeStyle("add-new-api-ok").onclick = function(){
			var host = nodeStyle("title-api-host").innerHTML;
			var address = nodeStyle("add-new-apiaddress").value;
			if(!/^\//.test(address)){
				alert("Please input Api Name!");
				return;
			}
			var xhr = getXhr();
			xhr.open("GET","/api/addNewApi/?host="+host+"&https="+isHttps+"&api="+address);
			xhr.onreadystatechange = function(){
				if(xhr.readyState==4){
					if(xhr.status == 200){
						var data = JSON.parse(xhr.responseText);
						nodeStyle("add-new-api-form",{display:"none"});
						getConfig(host);
					}
				}
			}
			xhr.send(null);
			
		}
		
		nodeStyle("add-new-api-cancel").onclick = function(){
			nodeStyle("add-new-api-form",{display:"none"});
		}
		
		function changeInfoBar(barName){

			if(barName == nowInfoBar)return;
			var oldObj = nodeStyle("info-contain-"+nowInfoBar);
			if(oldObj){
				oldObj.setAttribute("class", "");
				nodeStyle("info-main-"+nowInfoBar).style.display = "none";
			}

			nodeStyle("info-contain-"+barName).setAttribute("class", "infoActive");
			nodeStyle("info-main-"+barName,{display:"block"});
			nowInfoBar = barName;
			if(window["infoFun_"+barName])window["infoFun_"+barName](nowInfoConfig);
		}
		
		function infoFun_body(config){
			var xhr = getXhr();
			xhr.onreadystatechange = function(){
				if(xhr.readyState==4){
					if(xhr.status == 200){
						var res = JSON.parse(xhr.responseText);
						var bodyData = '';
						if(res.returnMode == "fixed"){
							bodyData = infoFun_body_fixed (res.returnConfig);
						}
						nodeStyle("info-main-body-return-mode-value").innerHTML = res.returnMode.toUpperCase();
						nodeStyle("info-main-body-edit-value").innerHTML = bodyData;
						nodeStyle("info-main-body-log-value").innerHTML = infoFun_body_log(res.changeLog);
					}
				}
			}
			xhr.open("GET","/api/getApiInfoBody/?host="+nowInfoConfig.host+"&https="+nowInfoConfig.isHttps+"&api="+nowInfoConfig.api);
			xhr.send(null);
		}
		function infoFun_body_fixed (obj, name, isNewMode){
			var returnHtml = (isNewMode?'':'<span class="info-body-data-'+obj.mode+'">')+(name!=null?'<span class="info-body-data-name" contentEditable="true">'+name+'</span>':'');
			returnHtml += '<span class="info-body-data-type">&lt;'+obj.mode+'&gt;</span>';
			returnHtml += '<div class="info-body-data-deleteItem">Delete</div>';
			returnHtml += '<div class="info-body-data-changeItem">Change</div>';
			
			if(obj.mode=="number" || obj.mode=="string" || obj.mode=="boolean"){
				returnHtml += '<span class="info-body-data-value" contentEditable="true">'+obj.value+'</span>';
			}else if(obj.mode=="array"){
				returnHtml += '<div class="info-body-data-addItem">Add Item</div>';
				for(var i =0;i<obj.value.length;i++){
					returnHtml += infoFun_body_fixed(obj.value[i]);
				}
			}else if(obj.mode=="object"){
				returnHtml += '<div class="info-body-data-addItem">Add Item</div>';
				for(var key in obj.value){
					returnHtml += '<span class="info-body-data-objItem">'+infoFun_body_fixed(obj.value[key],key)+'</span>';
				}
			}
			returnHtml += (isNewMode?'':'</span>');
			return returnHtml;
		}
		
		function infoFun_body_log(log){
			if(log.length==0)return "";
			return log.map(function(v){
				return '<div class="info-body-data-log-item" data-json=\''+JSON.stringify({returnMode:v.returnMode,returnConfig:v.returnConfig})+'\'><span class="info-body-data-log-item-time">'+(new Date(v.changeTime)).format('yyyy-MM-dd hh:mm:ss')+'</span><span class="info-body-data-log-item-type">'+v.returnMode.toUpperCase()+"&nbsp;&nbsp;&nbsp;&nbsp;"+JSON.stringify(v.returnConfig)+'</span><span class="info-body-data-log-item-recovery">Recovery This Structur</span></div>';
			}).join("");
		}
		
		nodeStyle("info-container-nav").onclick= function(e){
			var target = e.target || e.srcElement;
			if(target.nodeName.toLowerCase()!="span")return;
			
			var id = target.id.replace("info-contain-","");
			changeInfoBar(id);
		
		}
		
		function getInfoModeFixedInit(type){
			switch(type){
				case 'array':
					return '<span class="info-body-data-string"><span class="info-body-data-type">&lt;string&gt;</span><span class="info-body-data-deleteItem">Delete</span><span class="info-body-data-changeItem">Change</span><span class="info-body-data-value" contentEditable="true">Item Value</span></span>';
					break;
				case 'object':
					return '<span class="info-body-data-objItem"><span class="info-body-data-string"><span class="info-body-data-name" contentEditable="true">Item Name</span><span class="info-body-data-type">&lt;string&gt;</span><span class="info-body-data-deleteItem">Delete</span><span class="info-body-data-changeItem">Change</span><span class="info-body-data-value" contentEditable="true">Item Value</span></span></span>';
					break;
				default:
					return false;
					break;
			}
		}
		
		function modelFadeIn(){
			var node = nodeStyle("model-float",{display:"block"});
			setTimeout(function(){node.setAttribute("class","fadeIn");}, 0);
		}
		function modelFadeOut(){
			nodeStyle("model-float").setAttribute("class","");
			setTimeout(function(){nodeStyle("model-float",{display:"none"});}, 500);
		}
		function modelIn(title, content, clickCallback){
			modelFadeIn();
			nodeStyle("model-title").innerHTML = title;
			nodeStyle("model-contain").innerHTML = content();
			nodeStyle("model-float").onclick = function(){modelOut(modelFadeOut)};
			nodeStyle("model-container",{top:"50%",transform:"translate(-50%,-50%)"}).onclick = function(e){
				clickCallback(e);
				modelOut(modelFadeOut);
			}
		}
		function modelOut(callback){
			nodeStyle("model-container",{top:"0%",transform:"translate(-50%,-100%)"});
			setTimeout(callback, 100);
		}
		nodeStyle("info-main-body-edit-value").onclick= function(e){
			var target = e.target || e.srcElement;
			if(target.className == "info-body-data-addItem"){
				var container =  target.parentNode;
				var containerMode = container.className.split("-").pop();
				var newHtml = getInfoModeFixedInit(containerMode);
				if(!!newHtml){
					container.innerHTML += getInfoModeFixedInit(containerMode);
				}
			}else if(target.className == "info-body-data-deleteItem"){
				var container =  target.parentNode;
				if(container.parentNode && container.parentNode.className=="info-body-data-objItem"){
					container.parentNode.parentNode.removeChild(container.parentNode);
				}else if(container.parentNode){
					container.parentNode.removeChild(container);
				}
			}else if(target.className == "info-body-data-changeItem"){
				var container = target.parentNode;
				var nowMode = container.className.split("-").pop();
				var isObject = false;
				if(container.parentNode && container.parentNode.className == "info-body-data-objItem"){
					isObject = true;
				}
				modelIn("Change Data Mode", function(){
					var dataMode = ["string", "number", "boolean","array","object"];
					return dataMode.map(function(v){
						return '<span class="change-data-mode-btn" id="data-mode-value-'+v+'">'+v+'</span>';
					}).join("");
				}, function(e){
					e = e ||window.event;
					var targetNode = e.target || e.srcElement;
					if(targetNode.id.indexOf("data-mode-value")!=-1){
						var targetMode = targetNode.innerHTML;
						var resHtml = "";
						var newValue = "Item Value";
						if(targetMode == "number") newValue = 123;
						if(targetMode == "boolean") newValue = true;
						if(targetMode == "array") newValue = [];
						if(targetMode == "object") newValue = {};
						if(isObject){
							resHtml = infoFun_body_fixed({mode:targetMode, value:newValue},"Item Name",true);
						}else{
							resHtml = infoFun_body_fixed({mode:targetMode, value:newValue},null,true);
						}
						var newNode = document.createElement("span");
						newNode.setAttribute("class","info-body-data-"+targetMode);
						newNode.innerHTML = resHtml;
						container.parentNode.insertBefore(newNode, container);
						container.parentNode.removeChild(container);
					}
				});
			}
		}
		
		function fixedDataEditToObj(node) {
			var mode = node.className.split("-").pop();
			var child = [].slice.call(node.children);
			if(mode == "array"){
				var res = {
					mode: 'array',
					value: []
				}
				for(var i=0;i<child.length;i++){
					if(child[i].className == "info-body-data-type" || child[i].className == "info-body-data-addItem"|| child[i].className == "info-body-data-deleteItem"|| child[i].className == "info-body-data-changeItem"|| child[i].className == "info-body-data-name"){}else{
						res.value.push(fixedDataEditToObj(child[i]));
					}
				}
				return res;
			}else if(mode == "object"){
				var valueObject = {};
				for(var j=0;j<child.length;j++){
					if(child[j].className == "info-body-data-objItem"){
						var objItem = child[j].children[0];
						var objItemChild = [].slice.call(objItem.children);
						for(var i=0;i<objItemChild.length;i++){
							if(objItemChild[i].className == "info-body-data-name"){
								valueObject[objItemChild[i].innerHTML] = fixedDataEditToObj(objItem);
							}
						}
					}
				}
				return {
					mode:'object',
					value:valueObject
				}
			}else if(mode == "string"){
				return {
					mode:'string',
					value:child.map(function(v){
						if(v.className == "info-body-data-value"){
							return v.innerHTML;
						}
					}).join("")
				}
			}else if(mode == "number"){
				return {
					mode:'number',
					value:child.map(function(v){
						if(v.className == "info-body-data-value"){
							return v.innerHTML;
						}
					}).join("") - 0
				}
			}else if(mode == "boolean"){
				return {
					mode:'boolean',
					value:!!child.map(function(v){
						if(v.className == "info-body-data-value"){
							return v.innerHTML;
						}
					}).join("")
				}
			}
		}
		
		nodeStyle("info-main-body-btn-save").onclick = function(){
			nodeStyle("info-main-body-edit-load",{display:"block"});
			var valueNode = nodeStyle("info-main-body-edit-value");
			var valueObject = fixedDataEditToObj(valueNode.children[0]);
			var returnMode = nodeStyle("info-main-body-return-mode-value").innerHTML.toLowerCase();
			var xhr = getXhr();
			xhr.onreadystatechange = function(){
				if(xhr.readyState==4){
					if(xhr.status == 200){
						setTimeout(function(){
							nodeStyle("info-main-body-edit-load",{display:"none"});
							infoFun_body(nowInfoConfig);
						}, 500);
					}
				}
			}
			xhr.open("POST","/post/setApiBodyData/");
			xhr.send("host="+nowInfoConfig.host+"&https="+nowInfoConfig.isHttps+"&api="+nowInfoConfig.api+"&returnMode="+returnMode+"&bodyData="+JSON.stringify(valueObject));
		}
		
		nodeStyle("info-main-body-btn-cancel").onclick = function(){
			nodeStyle("info-main-body-edit-load",{display:"block"});
			setTimeout(function(){
				nodeStyle("info-main-body-edit-load",{display:"none"});
				infoFun_body(nowInfoConfig);
			}, 300);
		}
		nodeStyle("info-main-body-log").onclick = function(e){
			e = e ||window.event;
			var targetNode = e.target || e.srcElement;
			if(targetNode.className == "info-body-data-log-item-recovery"){
				var data = JSON.parse(targetNode.parentNode.getAttribute("data-json"));
				nodeStyle("info-main-body-edit-load",{display:"block"});
				var valueNode = nodeStyle("info-main-body-edit-value");
				var valueObject = data.returnConfig;
				var xhr = getXhr();
				xhr.onreadystatechange = function(){
					if(xhr.readyState==4){
						if(xhr.status == 200){
							setTimeout(function(){
								nodeStyle("info-main-body-edit-load",{display:"none"});
								infoFun_body(nowInfoConfig);
							}, 500);
						}
					}
				}
				xhr.open("POST","/post/setApiBodyData/");
				xhr.send("host="+nowInfoConfig.host+"&https="+nowInfoConfig.isHttps+"&api="+nowInfoConfig.api+"&returnMode="+data.returnMode+"&bodyData="+JSON.stringify(valueObject));
			}
		}