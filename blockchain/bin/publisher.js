#!/usr/bin/env node
import { default as yargs } from 'yargs';
import { default as redis } from 'redis';

var args = yargs
  .command('benchmark', 'Start benchmark', yargs => {
    return yargs
      .option('numOfProcess', {
        description: 'number of process on each device',
        default: 1
      })
      .option('txPerProcess', {
        description: 'number of tx per process (async)',
        default: 20
      })
      .option('size', {
        description: 'size data',
        default: 1024
      })
      .demand(['numOfProcess', 'txPerProcess', 'size']);
  })
  .help()
  .usage('Usage: $0 [command] [options]');

let { argv } = args;

if (argv._.length === 0) {
  args.showHelp();
}

let command = argv._[0];
let appCount = 0;
let completeCount = 0;
let totalSendLatency = 0;
let totalCompleteLatency = 0;
let startTime, endTime;

if (command === 'benchmark') {
  let { numOfProcess, txPerProcess, size } = argv;
  let subscriber = redis.createClient({ host: 'localhost', port: 8888 });
  subscriber.psubscribe('result:*');

  let publisher = redis.createClient({ host: 'localhost', port: 8888 });
  publisher.publish('node:ping', '');

  subscriber.on('pmessage', function(pattern, channel, message) {
    var method = channel.split(':')[1];
    if (method == 'pong') {
      appCount++;
    } else if (method == 'complete') {
      let result = JSON.parse(message);
      totalSendLatency += result.data.sendLatency;
      totalCompleteLatency += result.data.completeLatency;
      completeCount++;
      if (completeCount == appCount) {
        endTime = new Date().getTime();
        let totaltime = (endTime - startTime) / 1000;
        let totalTx = completeCount * numOfProcess * txPerProcess;
        console.log('Total time: ' + totaltime + ' sec');
        console.log('Transaction: ' + totalTx + ' tx');
        console.log(
          'Send latency: ' + totalSendLatency / completeCount + ' sec'
        );
        console.log(
          'Complete latency: ' + totalCompleteLatency / completeCount + ' sec'
        );
        console.log('Complete throughput: ' + totalTx / totaltime + ' tx/sec');
        process.exit(0);
      }
    }
  });

  startTime = new Date().getTime();
  publisher.publish(
    'node:start',
    '--process=' +
      numOfProcess +
      ',--txPerProcess=' +
      txPerProcess +
      ',--size=' +
      size
  );
}
