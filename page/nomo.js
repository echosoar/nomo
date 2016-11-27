var isHttps = false;
var nowInfoBar = '';
var nowInfoConfig = {host:'',api:'',apiName:'',isHttps:false};
		
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
			var res = {returnMode:"fixed",returnConfig:{mode:'array',value:[{mode:'number',value:123456},{mode:'object',value:{name:{mode:'string',value:'soar'},age:{mode:'number',value:21},hobby:{mode:'array',value:[{mode:'string',value:'篮球'},{mode:'string',value:'足球'}]}}}]}};
			var bodyData = '';
			if(res.returnMode == "fixed"){
				bodyData = infoFun_body_fixed (res.returnConfig);
				console.log(bodyData)
				
			}
			nodeStyle("info-main-body-return-mode-value").innerHTML = res.returnMode.toUpperCase();
			nodeStyle("info-main-body-edit-value").innerHTML = bodyData;
		}
		function infoFun_body_fixed (obj, name){
			var returnHtml = '<span class="info-body-data-'+obj.mode+'">'+(name!=null?'<span class="info-body-data-name" contentEditable="true">'+name+'</span>':'');
			returnHtml += '<span class="info-body-data-type">&lt;'+obj.mode+'&gt;</span>';
			returnHtml += '<div class="info-body-data-deleteItem">Delete</div>';
			returnHtml += '<div class="info-body-data-changeItem">Change</div>';
			
			if(obj.mode=="number" || obj.mode=="string"){
				returnHtml += '<span class="info-body-data-value" contentEditable="true">'+obj.value+'</span>';
			}else if(obj.mode=="array"){
				for(var i =0;i<obj.value.length;i++){
					returnHtml += '<div class="info-body-data-addItem">Add Item</div>';
					returnHtml += infoFun_body_fixed(obj.value[i]);
				}
			}else if(obj.mode=="object"){
				returnHtml += '<div class="info-body-data-addItem">Add Item</div>';
				for(var key in obj.value){
					returnHtml += '<span class="info-body-data-objItem">'+infoFun_body_fixed(obj.value[key],key)+'</span>';
				}
			}
			returnHtml += '</span>';
			return returnHtml;
		}
		
		nodeStyle("info-container-nav").onclick= function(e){
			var target = e.target || e.srcElement;
			if(target.nodeName.toLowerCase()!="span")return;
			
			var id = target.id.replace("info-contain-","");
			changeInfoBar(id);
		
		}
		
		nodeStyle("info-main-body-edit-value").onclick= function(e){
			var target = e.target || e.srcElement;
			console.log(target)
		
		}