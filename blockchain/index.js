#!/usr/bin/env node
import { default as Web3 } from 'web3';
import { default as truffleContract } from 'truffle-contract';

const RPC_HOST = '192.168.3.98';
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
    console.log(
      'event|' +
        events.args.sequence.valueOf() +
        '|' +
        events.args.data.valueOf().length +
        '|' +
        new Date().getTime()
    );
  });
});

function createTransaction(seq, data) {
  console.log('sendTx|' + seq + '|' + data.length + '|' + new Date().getTime());
  Benchmark.deployed().then(function(instance) {
    instance.writeData
      .sendTransaction(seq, data, { from: account, gas: '50000000' })
      .then(function(txhash) {
        console.log(
          'sendComplete|' + seq + '|' + data.length + '|' + new Date().getTime()
        );
      });
  });
}

export const quorumInterface = {
  createTransaction
};

export default quorumInterface;
