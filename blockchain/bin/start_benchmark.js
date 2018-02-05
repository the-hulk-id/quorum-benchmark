#!/usr/bin/env node
import { fork } from 'child_process';

let numOfProcess = 1;
let numOfTx = 10;
let size = 10;

let countProcess = 0;
let sendCompleteResult = 0;
let writeCompleteResult = 0;

let totalSendLatency = 0;
let totalCompleteLatency = 0;

let startTime, endTime;

for (var i = 0; i < numOfProcess; i++) {
  var worker = fork('./bin/benchmark.js', [
    '--numOfTx=' + numOfTx,
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
        console.log(
          'Send latecy: ' +
            (totalSendLatency / numOfProcess).toFixed(3) +
            ' sec'
        );
      }
    }

    if (message.data.result == 'WriteComplete') {
      totalCompleteLatency += message.data.writeLatency;
      writeCompleteResult++;
      if (writeCompleteResult == numOfProcess) {
        endTime = new Date().getTime();
        console.log(
          'Complete latecy: ' +
            (totalCompleteLatency / numOfProcess).toFixed(3) +
            ' sec'
        );
        console.log('Total time: ' + (endTime - startTime) / 1000 + ' sec');
      }
    }
  });
}
