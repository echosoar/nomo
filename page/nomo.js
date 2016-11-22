var isHttps = false;
		
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
								temElement.innerHTML = v + '<div class="host-list-onOrOff host-list-onOrOff-off"><i></i></div><i class="host-list-api btn-circle" id="host-list-api-'+index+'">Api</i><i class="host-list-del btn-circle" id="host-list-del-'+index+'">Del</i>';
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
			
			if(target.innerHTML == "Del" && confirm("Do you really want to delete this one?")){
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
			}else if(target.innerHTML == "Api"){
				var host = target.parentNode.innerHTML.split("<")[0];
				nodeStyle("main",{display:"none"});
				nodeStyle("add-new-api-form",{display:"none"});
				nodeStyle("api",{display:"block"});
				nodeStyle("title-api-host").innerHTML= host;
				getConfig(host);
			}
		}
		
		nodeStyle("return-to-host-list").onclick = function(){
			nodeStyle("api",{display:"none"});
			nodeStyle("main",{display:"block"});
			nodeStyle("api-info-regetip",{display:"none"});
			nodeStyle("api-info-setip",{display:"none"});
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
					}
				}
			}
			xhr.send(null);
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
						
					}
				}
			}
			xhr.send(null);
			
		}