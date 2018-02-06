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

if (command === 'benchmark') {
  let publisher = redis.createClient({ host: 'localhost', port: 8888 });
  let { numOfProcess, txPerProcess, size } = argv;
  publisher.publish(
    'node:1',
    '--process=' +
      numOfProcess +
      ',--txPerProcess=' +
      txPerProcess +
      ',--size=' +
      size
  );

  let subscriber = redis.createClient({ host: 'localhost', port: 8888 });
  subscriber.on('pmessage', function(pattern, channel, message) {
    console.log(JSON.parse(message));
  });
  subscriber.psubscribe('result:*');
}
