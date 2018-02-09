#!/usr/bin/env node
import { default as Web3 } from 'web3';
import { default as truffleContract } from 'truffle-contract';

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/result.csv', { flags: 'a' });

function logger(d) {
  log_file.write(util.format(d) + '\n');
}

const RPC_HOST = 'localhost';
const RPC_PORT = '22000';

var benchmarkJSON;
try {
  benchmarkJSON = require('./build/contracts/Benchmark.json');
} catch (error) {
  benchmarkJSON = require('./contracts/Benchmark.json');
}

let provider = new Web3.providers.HttpProvider(
  `http:\/\/${RPC_HOST}:${RPC_PORT}`
);
let web3 = new Web3(provider);

var account = web3.eth.accounts[0];
let Benchmark = truffleContract(benchmarkJSON);
Benchmark.setProvider(provider);

Benchmark.deployed().then(function(instance) {
  var event = instance.FinishWrite();
  event.watch(function(error, events) {
    console.log(events.args.sequence.valueOf());
    logger(
      new Date().getTime() +
        '|' +
        events.args.sequence.valueOf() +
        '|' +
        events.args.data.valueOf().length +
        '|event'
    );
  });
});

function createTransaction(seq, data) {
  logger(new Date().getTime() + '|' + seq + '|' + data.length + '|sendTx');
  Benchmark.deployed().then(function(instance) {
    instance.writeData
      .sendTransaction(seq, data, { from: account, gas: '50000000' })
      .then(function(txhash) {
        logger(
          new Date().getTime() + '|' + seq + '|' + data.length + '|sendComplete'
        );
      });
  });
}

export const quorumInterface = {
  createTransaction
};

export default quorumInterface;
