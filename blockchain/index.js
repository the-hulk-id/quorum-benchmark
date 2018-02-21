#!/usr/bin/env node
import { default as Web3 } from 'web3';
import { default as truffleContract } from 'truffle-contract';
import moment from 'moment-timezone';
import crypto from 'crypto';

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

  var eventWithoutHash = instance.FinishWriteWithoutHash();
  eventWithoutHash.watch(function(error, events) {
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

function createTransactionWithoutHash(seq, data) {
  const hash1 = crypto.createHash('sha256');
  hash1.update('testData1');
  let sha1 = hash1.digest('hex');

  const hash2 = crypto.createHash('sha256');
  hash2.update('testData2');
  let sha2 = hash2.digest('hex');

  const hash3 = crypto.createHash('sha256');
  hash3.update('testData3');
  let sha3 = hash3.digest('hex');

  var now = moment()
    .tz('Asia/Bangkok')
    .format('YYMMDDHHmmss.SSS');

  Benchmark.deployed().then(function(instance) {
    console.log(now + '|' + seq + '|' + data.length + '|' + 'sendTx');
    instance.writeDataWithoutHash
      .sendTransaction(seq, data, sha1, sha2, sha3, {
        from: account,
        gas: '50000000'
      })
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
