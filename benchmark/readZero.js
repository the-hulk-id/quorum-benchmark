var header = require('./header.js');

var ABI = header.settings.ABI;

var argv = require('minimist')(process.argv.slice(2));
const count = argv.numOfTx;
const size = argv.size;;

const DEFAULT_GAS = '50000000';

var readCompleteResult = 0;
var totalTimeReadComplete;

if(header.cluster.isMaster) 
{

	console.log("=================");
	var timeStart = new Date().getTime();
	console.log("Start read zero size: " + size + " byte");
	console.log("=================");

	var json = require('read-data').json;
	var data = json.sync('contractAddress.json');
	var contractaddress = data.Address;

	for(var i = 0; i < count; i++)
	{
		var env = {};
		env["id"] = (i+1);
		env["address"] = contractaddress;
		var worker = header.cluster.fork(env);

		worker.on('message', function(message) {

			if(message.data.result=="ReadZeroComplete")
			{
				readCompleteResult++;
				if(readCompleteResult%10 == 0)
					console.log("Read completed: " + readCompleteResult + " tx");

				if(readCompleteResult >= count)
				{
					var timeEnd = new Date().getTime();
					totalTimeReadComplete = (timeEnd-timeStart)/1000

					console.log("=================");
					console.log("Complete read zero size: " + size + " byte");
					console.log("=================");

					process.send({
						data: {
							size: count,
							totalTimeReadComplete: totalTimeReadComplete
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
    var Contract = header.web3.eth.contract(ABI);
	var contractInstance = null;
	contractInstance = Contract.at(process.env["address"]);

	contractInstance.readZeroString(size,
	{
		from: header.web3.eth.accounts[0],
		gas: DEFAULT_GAS
	},function(error, result){
		// Don't care result just complete
		process.send({
			data: {
				result: "ReadZeroComplete",
				contractAddress: process.env["address"]
			}
		})
		process.exit(0);
	});	
}