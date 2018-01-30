module.exports.settings = require("./contractData.js");
module.exports.cluster = require("cluster");
module.exports.BigNumber = require("bignumber.js");
module.exports.asyncLoop = require("node-async-loop");
module.exports.randomstring = require("randomstring");
module.exports.writeJson = require("write-json");
module.exports.arrayRange = require("array-range");
module.exports.moment = require("moment");
module.exports.fork = require("child_process").fork;
module.exports.Web3 = require("web3");
module.exports.http = require("http");
module.exports.async = require("asyncawait/async");
module.exports.await = require("asyncawait/await");
var Web3 = require("web3");
if (typeof module.exports.web3 !== "undefined") {
	module.exports.web3 = new Web3(module.exports.web3.currentProvider);
} else {
	module.exports.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22000"));
	console.log(module.exports.web3.isConnected());
}
