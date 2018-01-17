var header = require('./header.js');

var ABI = header.settings.ABI;

const DEFAULT_GAS = '50000000';
var readCompleteResult = 0;

var argv = require('minimist')(process.argv.slice(2));
const count = argv.numOfTx;
const size = argv.size;
const page = argv.page;

var totalTimeRead;

if(header.cluster.isMaster) 
{
	var timeStart = new Date().getTime();
	console.log("=================");
	console.log("Start read size: " + size + " byte");
	console.log("=================");

	var json = require('read-data').json;
	var data = json.sync('contractAddress.json');
	var contractAddress = data.Address;

	for(var i = 0; i < count; i++)
	{
		var env = {};
		env["id"] = (page*count)+(i+1);
		env["address"] = contractAddress;
		var worker = header.cluster.fork(env);

		worker.on('message', function(message) {

			if(message.data.result=="ReadComplete")
			{
				readCompleteResult++;
				// console.log(readCompleteResult);
				if(readCompleteResult%10 == 0)
					console.log("Read completed: " + readCompleteResult + " tx");
				if(readCompleteResult >= count)
				{
					var timeEnd = new Date().getTime();
					totalTimeRead = (timeEnd-timeStart)/1000;
					console.log("=================");

					
					console.log("=================");
					console.log("Complete read size: " + size + " byte");
					console.log("=================");

					process.send({
						data: {
							size: size,
							totalTimeRead: totalTimeRead
						}
					})
					
					process.exit(0);
				}
			}
		});

    }
}
else
{
    var WriteReadContract = header.web3.eth.contract(ABI);
	var contractInstance = null;
	contractInstance = WriteReadContract.at(process.env["address"]);

	var id = new header.BigNumber(process.env["id"]);
	timeStart = new Date().getTime();

	contractInstance.readString(id,
	{
		from: header.web3.eth.accounts[0],
		gas: DEFAULT_GAS
	},function(error, result){
		if(error != undefined)
            console.log(error);
        else
        {
			//console.log(result.toString().length);
			if(result.length == size)
			{
				process.send({
					data: {
						result: "ReadComplete",
						contractAddress: process.env["address"]
					}
				})
				process.exit(0);
			}
        }
	});
}
