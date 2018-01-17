var header = require('./header.js');

var ABI = header.settings.ABI;

var argv = require('minimist')(process.argv.slice(2));
const count = argv.numOfTx;
const size = argv.size;
const page = argv.page;

const DEFAULT_GAS = '50000000';

var callCompleteResult = 0;
var sendCompleteResult = 0;
var writeCompleteResult = 0;

var totalTimeCall;
var totalTimeSend;
var totalTimeComplete;

var completedArray = [];

if(header.cluster.isMaster) 
{

	var timeStart = new Date().getTime();
	console.log("=================");
	console.log("Start write size: " + size + " byte");
	console.log("=================");

	var json = require('read-data').json;
	var data = json.sync('contractAddress.json');
	var contractaddress = data.Address;

	for(var i = 0; i < count; i++)
	{
		var env = {};
		env["id"] = (page*count)+(i+1);
		env["address"] = contractaddress;
		var worker = header.cluster.fork(env);

		worker.on('message', function(message) {

			if(message.data.result=="CallComplete")
			{
				callCompleteResult++;
				if(callCompleteResult%10 == 0)
					console.log("Call completed: " + callCompleteResult + " tx");
				if(callCompleteResult >= count)
				{
					var timeEnd = new Date().getTime();
					totalTimeCall = (timeEnd-timeStart)/1000;
					console.log("=================");
				}
			}

			if(message.data.result=="SendComplete")
			{
				sendCompleteResult++;
				if(sendCompleteResult%10 == 0)
					console.log("Send completed: " + sendCompleteResult + " tx");
				if(sendCompleteResult >= count)
				{
					timeEnd = new Date().getTime();
					totalTimeSend = (timeEnd-timeStart)/1000;
					console.log("=================");
				}
			}

			if(message.data.result=="WriteComplete")
			{
				writeCompleteResult++;
				if(writeCompleteResult%10 == 0)
					console.log("Write completed: " + writeCompleteResult + " tx");
				if(writeCompleteResult >= count)
				{
					timeEnd = new Date().getTime();
					totalTimeComplete = (timeEnd-timeStart)/1000

					console.log("=================");
					console.log("Complete write size: " + size + " byte");
					console.log("=================");

					process.send({
						data: {
							size: size,
							totalTimeCall: totalTimeCall,
							totalTimeSend: totalTimeSend,
							totalTimeComplete: totalTimeComplete,
							contractAddress: message.data.contractAddress
						}
					})
					
					process.exit(0);
				}
			}

		})

    }

}
else
{
	
    var WriteReadContract = header.web3.eth.contract(ABI);

	var contractInstance = null;

	contractInstance = WriteReadContract.at(process.env["address"]);

	var stringData = header.randomstring.generate(size);
	var id = new header.BigNumber(process.env["id"]);

	timeStart = new Date().getTime();

	contractInstance.writeNothing(id,stringData,
	{
		from: header.web3.eth.accounts[0],
		gas: DEFAULT_GAS
	},function(error, result){
		process.send({
			data: {
				result: "CallComplete"
			}
		})
	});

	contractInstance.writeString(id,stringData,
	{
		from: header.web3.eth.accounts[0],
		gas: DEFAULT_GAS
	},function(error, result){

		process.send({
			data: {
				result: "SendComplete"
			}
		})

		var eventWrite = contractInstance.FinishWrite();

		eventWrite.watch(function(error, result) {

			if (result.args.data.length == size && completedArray[id] == undefined)
			{
				completedArray[id] = true;
				process.send({
					data: {
						result: "WriteComplete",
						contractAddress: process.env["address"]
					}
				})
				process.exit(0);
			}
			
		});

	});
	
}