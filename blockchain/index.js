#!/usr/bin/env node
import { default as Web3 } from 'web3';
import { default as truffleContract } from 'truffle-contract';
import moment from 'moment-timezone';

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
    var now = moment()
      .tz('Asia/Bangkok')
      .format('YYMMDDHHmmss.SSS');
    var seq = events.args.sequence.valueOf();
    var data = events.args.data.valueOf();
    var sha1 = events.args.sha1.valueOf();
    var sha2 = events.args.sha1.valueOf();
    var sha3 = events.args.sha1.valueOf();
    console.log(now + '|' + seq + '|' + data.length + '|' + 'completedTx');
    logger(now + '|' + seq + '|' + sha1 + '|' + sha2 + '|' + sha3);
  });
});

function createTransaction(seq, data) {
  var now = moment()
    .tz('Asia/Bangkok')
    .format('YYMMDDHHmmss.SSS');
  // console.log(now + '|' + seq + '|' + data);
  console.log(now + '|' + seq + '|' + data.length + '|' + 'sendTx');
  Benchmark.deployed().then(function(instance) {
    instance.writeData
      .sendTransaction(seq, data, { from: account, gas: '50000000' })
      .then(function(txhash) {
        now = moment()
          .tz('Asia/Bangkok')
          .format('YYMMDDHHmmss.SSS');
        console.log(now + '|' + seq + '|' + data.length + '|gotTx');
      });
  });
}

export const quorumInterface = {
  createTransaction
};

export default quorumInterface;
