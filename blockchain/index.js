#!/usr/bin/env node
import { default as Web3 } from 'web3-quorum';
import { default as truffleContract } from 'truffle-contract';
import moment from 'moment-timezone';
import crypto from 'crypto';

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/result.csv', { flags: 'a' });

const path = require('path');
let addresssFilePath = path.join(__dirname, '/contract_addresses.json');

var data = fs.readFileSync(addresssFilePath, 'utf8');
var addressObj = JSON.parse(data);
console.log(addressObj);

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

var benchmarkInstance = Benchmark.at(addressObj.Benchmark);
var event = benchmarkInstance.FinishWrite(
  {},
  { fromBlock: 0, toBlock: 'latest' }
);
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

function createTransaction(seq, data, node) {
  var now = moment()
    .tz('Asia/Bangkok')
    .format('YYMMDDHHmmss.SSS');

  var instance = Benchmark.at(addressObj.Benchmark);
  console.log(now + '|' + seq + '|' + data.length + '|' + 'sendTx');
  instance.writeData
    .sendTransaction(seq, data, {
      from: account,
      gas: '50000000'
    })
    .then(function(txhash) {
      now = moment()
        .tz('Asia/Bangkok')
        .format('YYMMDDHHmmss.SSS');
      console.log(now + '|' + seq + '|' + data.length + '|gotTx');
    });
}

function createTransactionWithoutHash(seq, data) {
  // const hash1 = crypto.createHash('sha256');
  // hash1.update('testData1');
  // let sha1 = hash1.digest('hex');

  // const hash2 = crypto.createHash('sha256');
  // hash2.update('testData2');
  // let sha2 = hash2.digest('hex');

  // const hash3 = crypto.createHash('sha256');
  // hash3.update('testData3');
  // let sha3 = hash3.digest('hex');

  let sha1 = '1111111';
  let sha2 = '2222222';
  let sha3 = '3333333';

  var now = moment()
    .tz('Asia/Bangkok')
    .format('YYMMDDHHmmss.SSS');

  var instance = Benchmark.at(addressObj.Benchmark);
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
}

export const quorumInterface = {
  createTransaction,
  createTransactionWithoutHash
};

export default quorumInterface;
