#!/usr/bin/env node
import { default as Web3 } from 'web3';
import { default as truffleContract } from 'truffle-contract';

const RPC_HOST = 'localhost';
const RPC_PORT = '22000';

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

Benchmark.deployed().then(function(instance) {
  timeStart = new Date().getTime();
  instance.writeData
    .sendTransaction('data' + timeStart, 0, { from: account })
    .then(function(txhash) {
      timeEnd = new Date().getTime();
      console.log('Send tx: ' + (timeEnd - timeStart) / 1000);
      var event = instance.FinishWrite();
      event.watch(function(error, events) {
        if (events.args.data == 'data' + timeStart) {
          timeEnd = new Date().getTime();
          console.log('Complete tx: ' + (timeEnd - timeStart) / 1000);
          event.stopWatching();
        }
      });
    });
});
