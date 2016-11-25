### Nomo

```html

			   ___  
			 /\   \  
			/::\   \              ________  
		   /::::\   \            /::::\   \  
		  /::::::\___\          /::::::\   \  
		 /:::|:::|   |         /:: __:::\   \  
		/:::/|:::|   |___     /:::/  \:::\___\  
	   /:::/ |:::|   /\   \  /:::/    \::|   |  
	   \::/  |:::|  /::\___\|:::/     |::|   |  
		\/___|:::| /:::/   /|::|     /:::|___|  
			 |:::|/:::/   / |:::\   /:::/   /  
			 |:::::::/   /   \:::\_/:::/   /  
			 \::::::/   /     \:::::::/   /  
			  \::::/   /       \:::::/   /  
			   \::/   /         \___/___/  
				\/___/  
					
			   ___     
			 /\   \     
			/::\   \              ________  
		   /::::\   \            /::::\   \  
		  /::::::|___\          /::::::\   \  
		 /:::|:::|   |         /:: __:::\   \  
		/:::/|:::|___|____    /:::/  \:::\___\  
	   /:::/ |::::::::\   \  /:::/    \::|   |  
	   \::/  |:::::::::\___\|:::/     |::|   |  
		\/___/ˉˉˉˉˉ/:::/   /|::|     /:::|___|  
				  /:::/   / |:::\   /:::/   /  
				 /:::/   /   \:::\_/:::/   /  
				/:::/   /     \:::::::/   /  
			   /:::/   /       \:::::/   /  
			   \::/   /         \___/___/  
				\/___/  
			  

```

***

How to use?

    let nomo = require("nomo");
  
    nomo.start();
  
***

### Api Config File：

```javascript
    
	{
		returnMode:String,
		returnConfig:Object,
		dataMap:Object
	}
	
```

##### returnMode 

You can choose the returned data mode of the requested interface.

+ "mock" : Use Mock.js
+ "fixed" : [Default] Use fixed data. 
+ "request" : You can configure data mappings of requested data to returned data.

##### returnConfig

mode: ['placeholder', 'template', 'object', 'array']

For example:

```javascript
    
	{
		returnMode: "mock",
		returnConfig: {
			mode:'placeholder',
			value:'@url'
		}
	}
	
	The return data is:
	
	'news://gig.za/ldrlki'
	    
```

For example:

```javascript
    
	{
		returnMode: "mock",
		returnConfig: {
			mode:'template',
			range:'1-4',
			style:'object',
			value:{
				"310000": "上海市",
				"320000": "江苏省",
				"330000": "浙江省",
				"340000": "安徽省"
			}
		}
	}
	
	The return data is:
	
	{
		"310000": "上海市",
		"320000": "江苏省"
	}
	    
```

For example:

```javascript
    
	{
		returnMode: "mock",
		returnConfig: {
			mode:'object',
			value:{
				name:{
					mode:'placeholder',
					value:'@cname'
				},
				age:{
					mode:'placeholder',
					value:'@integer(10, 70)'
				}',
				hobby:{
					mode:'template',
					range:'1-3',
					style:'array',
					value:['足球','乒乓球','羽毛球']
				}
			}
		}
	}
	
	The return data is:
	
	{
		name:'朱强',
		age:12,
		hobby:['足球','羽毛球']
	}
	    
```

***
  

