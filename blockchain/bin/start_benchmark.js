#!/usr/bin/env node
import { fork } from 'child_process';

var argv = require('minimist')(process.argv.slice(2));
let numOfProcess = argv.process;
let txPerProcess = argv.txPerProcess;
let size = argv.size;

console.log(argv);

if (!numOfProcess) {
  numOfProcess = 1;
}
if (!txPerProcess) {
  txPerProcess = 20;
}
if (!size) {
  size = 1024;
}

let countProcess = 0;
let sendCompleteResult = 0;
let writeCompleteResult = 0;

let totalSendLatency = 0;
let totalCompleteLatency = 0;

let startTime, endTime;

let sendLatency, completeLatency, totaltime;

for (var i = 0; i < numOfProcess; i++) {
  var worker = fork('./bin/benchmark.js', [
    '--numOfTx=' + txPerProcess,
    '--size=' + size
  ]);

  worker.on('message', function(message) {
    if (message.data.result == 'StartBenchmark') {
      countProcess++;
      if (countProcess == numOfProcess) {
        startTime = new Date().getTime();
      }
    }

    if (message.data.result == 'SendComplete') {
      totalSendLatency += message.data.sendLatency;
      sendCompleteResult++;
      if (sendCompleteResult == numOfProcess) {
        sendLatency = totalSendLatency / numOfProcess;
        console.log('Send latecy: ' + sendLatency.toFixed(3) + ' sec');
      }
    }

    if (message.data.result == 'WriteComplete') {
      totalCompleteLatency += message.data.writeLatency;
      writeCompleteResult++;
      if (writeCompleteResult == numOfProcess) {
        endTime = new Date().getTime();
        completeLatency = totalCompleteLatency / numOfProcess;
        console.log('Complete latecy: ' + completeLatency.toFixed(3) + ' sec');
        totaltime = (endTime - startTime) / 1000;
        console.log('Total time: ' + totaltime + ' sec');

        process.send({
          data: {
            result: 'Complete',
            sendLatency: sendLatency,
            completeLatency: completeLatency,
            totaltime: totaltime
          }
        });
        process.exit(0);
      }
    }
  });
}
