"use strict";
let isBinary = contentType => {
	if(/image/i.test(contentType)) return true;
	return false;
}

module.exports = isBinary;