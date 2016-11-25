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

```JSON
    
	{
		returnMode:String,
		returnConfig:Object,
		dataMap:Object
	}
	
```

##### returnMode 

You can choose the returned data mode of the requested interface.

+ "mock" : Use Mock.js
+ "rand" : Data by random.
+ "request" : You can configure data mappings of requested data to returned data.

***
  
 Data Mock Tool.
