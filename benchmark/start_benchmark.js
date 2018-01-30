var header = require('./header.js');

var ABI = header.settings.ABI;
var bytecode = header.settings.bytecode;

var WriteReadContract = header.web3.eth.contract(ABI);

//var size = [Math.pow(2, 8), Math.pow(2, 9), Math.pow(2, 10), Math.pow(2, 11), Math.pow(2, 12), Math.pow(2, 13), Math.pow(2, 14)];
var size = [256, 512];

var numOfTx = 10;

var argv = require('minimist')(process.argv.slice(2));
if (argv.tx != undefined)
{
	numOfTx = argv.tx;
}

var resultJSON = {};
var index = 0;
var writeData = [];
var readData = [];
var readZeroData = [];
var genesis = header.web3.eth.getBlock(0);

console.log("=================");
console.log("Deploying contract");

var contract = WriteReadContract.new({from: header.web3.eth.accounts[0], gas: 1000000, data: bytecode});

(header.async (function waitBlock() {
	while (true) {
		var receipt = header.web3.eth.getTransactionReceipt(contract.transactionHash);
		if (receipt && receipt.contractAddress) {
			console.log("Contract mined! Address: " + receipt.contractAddress);
			resultJSON["Address"] = receipt.contractAddress
			header.writeJson.sync('contractAddress.json', resultJSON);
			header.await (StartBenchmark());
			break;
		}
		header.await (sleep(4000));
	}
}))();

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function StartBenchmark() {
	Write();
}

function Write() {

	index = 0;

	header.asyncLoop(size, function (i_size, nextSize)
	{
		var worker = header.fork('./write.js', ['--numOfTx='+numOfTx, '--size='+i_size, '--page='+size.indexOf(i_size)]);
		worker.on('message', function(message) {

			console.log("Total tx send: " + numOfTx + " tx");
			console.log("Total time call: " + message.data.totalTimeCall + " sec");
			console.log("Total time send: " + message.data.totalTimeSend + " sec");
			console.log("Total time complete: " + message.data.totalTimeComplete + " sec");
			GetBlockTime();

			var data = {
				size: i_size,
				call_latency: message.data.totalTimeCall/numOfTx,
				sendTX_latency: message.data.totalTimeSend/numOfTx,
				completed_latency: message.data.totalTimeComplete/numOfTx,
				call_throughput: numOfTx/message.data.totalTimeCall,
				sendTX_throughput: numOfTx/message.data.totalTimeSend,
				completed_throughput: numOfTx/message.data.totalTimeComplete
			}

			writeData[index++]  = data;
			resultJSON["Write"] = writeData;

			nextSize();
		})

	}, function (err)
	{
		if (err)
		{
			console.error('Error: ' + err.message);
			return;
		}

		var blockchain = {
			difficulty: genesis.difficulty.c[0],
			blocktime: GetBlockTime()
		}
		resultJSON["Blockchain"] = blockchain;
		// header.writeJson.sync('WriteReadResult.json', resultJSON);
		// console.log("Write completed");
		// process.exit();
		Read();
	});
}

function Read() {

	index = 0;

	header.asyncLoop(size, function (i_size, nextSize)
	{

		// var address = "--contractAddress='"+contractAddress[i_size]+"'";
		var worker = header.fork('./read.js', ['--numOfTx='+numOfTx, '--size='+i_size, '--page='+size.indexOf(i_size)]);

		worker.on('message', function(message) {
			console.log("Total time read: " + message.data.totalTimeRead + " sec");
			GetBlockTime();

			var data = {
				size: i_size,
				latency: message.data.totalTimeRead/numOfTx,
				throughput: numOfTx/message.data.totalTimeRead
			}

			readData[index++]  = data;
			resultJSON["Read"] = readData;

			nextSize();
		})

	}, function (err)
	{
		if (err)
		{
			console.error('Error: ' + err.message);
			return;
		}

		// header.writeJson.sync('WriteReadResult.json', resultJSON);
		// console.log("Read completed");
		// process.exit();
		ReadZero();
	});
}

function ReadZero() {

	index = 0;

	header.asyncLoop(size, function (i_size, nextSize)
	{

		var worker = header.fork('./readZero.js', ['--numOfTx='+numOfTx, '--size='+i_size]);

		worker.on('message', function(message) {
			console.log("Total time read zero: " + message.data.totalTimeReadComplete + " sec");
			GetBlockTime();

			var data = {
				size: i_size,
				latency: message.data.totalTimeReadComplete/numOfTx,
				throughput: numOfTx/message.data.totalTimeReadComplete
			}

			readZeroData[index++]  = data;
			resultJSON["ReadZero"] = readZeroData;

			nextSize();
		})

	}, function (err)
	{
		if (err)
		{
			console.error('Error: ' + err.message);
			return;
		}

		var blockchain = {
			difficulty: genesis.difficulty.c[0],
			blocktime: GetBlockTime(),
			numOfTx: numOfTx
		}
		resultJSON["Blockchain"] = blockchain;

		header.writeJson.sync('WriteReadResult.json', resultJSON);
		process.exit();
	});

}

function GetBlockTime() {
	var blockNumber = header.web3.eth.blockNumber;
	var totalBlockTime = 0;

	var firstblock = header.web3.eth.getBlock(1);
	var lastBlock = header.web3.eth.getBlock(blockNumber);
	if (lastBlock == undefined)
	{
		lastBlock = header.web3.eth.getBlock(blockNumber-1);
	}

	if (firstblock.timestamp.toString().length == 19)
	{
		totalBlockTime += ((lastBlock.timestamp/1000000000)-(firstblock.timestamp/1000000000));
	}
	else
	{
		totalBlockTime += lastBlock.timestamp-firstblock.timestamp;
	}
	
	console.log("Avg Blocktime: " + totalBlockTime/blockNumber+" sec");
	return (totalBlockTime/blockNumber);
}

var resultBlockJSON = {};
var totalTx = 0;
var blockCount = 0;

header.web3.eth.filter("latest", function(err, block) {
	if (header.web3.eth.getBlock(block).transactions.length > 0)
	{
		totalTx +=  header.web3.eth.getBlock(block).transactions.length;
		blockCount++;
		resultBlockJSON["txPerBlock"] = totalTx/blockCount;
		header.writeJson.sync('blockData.json', resultBlockJSON);
	}
});
