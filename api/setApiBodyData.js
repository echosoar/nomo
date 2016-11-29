"use strict";

const path = require("path");
const fs = require("fs");

let setApiBodyData = (obj, data) => {
	console.log(data)
	obj.body = "success!";
	
}
module.exports = setApiBodyData;