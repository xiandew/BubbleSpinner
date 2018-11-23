const utils = require('./utils');

worker.onMessage(function (res) {
	console.log(res)
	worker.postMessage(res);
});