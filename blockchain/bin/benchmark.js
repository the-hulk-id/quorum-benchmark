#!/usr/bin/env node
import { default as Web3 } from 'web3';
import { default as truffleContract } from 'truffle-contract';
import { default as randomstring } from 'randomstring';

const RPC_HOST = '192.168.3.98';
const RPC_PORT = '22000';

var argv = require('minimist')(process.argv.slice(2));
let numOfTx = argv.numOfTx;
let size = argv.size;

let provider = new Web3.providers.HttpProvider(
  `http:\/\/${RPC_HOST}:${RPC_PORT}`
);
let web3 = new Web3(provider);

var benchmarkJSON;
try {
  benchmarkJSON = require('./../build/contracts/Benchmark.json');
} catch (error) {
  benchmarkJSON = require('./../contracts/Benchmark.json');
}

let Benchmark = truffleContract(benchmarkJSON);
Benchmark.setProvider(provider);

var timeStart, timeEnd, benchmark;

var account = web3.eth.accounts[0];
var count = 0;
var sendCount = 0;

var totalTimeSend = 0;
var totalTimeComplete = 0;

process.send({
  data: {
    result: 'StartBenchmark'
  }
});

var startTime = new Date().getTime();

sendTx();

function sendTx() {
  Benchmark.deployed().then(function(instance) {
    let data = randomstring.generate(size);
    console.log(data);
    timeStart = new Date().getTime();
    instance.writeData
      .sendTransaction(data, 0, { from: account })
      .then(function(txhash) {
        // console.log(txhash);
        timeEnd = new Date().getTime();
        // console.log('Send tx: ' + (timeEnd - timeStart) / 1000);
        totalTimeSend += (timeEnd - timeStart) / 1000;
        // console.log(totalTimeSend);
        sendCount++;
        if (sendCount == numOfTx) {
          process.send({
            data: {
              result: 'SendComplete',
              sendLatency: totalTimeSend / numOfTx
            }
          });
        }

        var event = instance.FinishWrite();
        event.watch(function(error, events) {
          console.log(events.args.data);
          if (events.args.data == data) {
            timeEnd = new Date().getTime();
            // console.log('Complete tx: ' + (timeEnd - timeStart) / 1000);
            totalTimeComplete += (timeEnd - timeStart) / 1000;
            count++;
            // console.log(count);
            if (count == numOfTx) {
              var completeTime = new Date().getTime();
              // console.log('Total time: ' + (completeTime - startTime) / 1000);

              process.send({
                data: {
                  result: 'WriteComplete',
                  writeLatency: totalTimeComplete / numOfTx
                }
              });
              process.exit(0);
            }

            event.stopWatching();
            sendTx();
          }
        });
      });
  });
}
