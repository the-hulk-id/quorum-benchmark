#!/usr/bin/env node

import { fork } from 'child_process';
import { default as redis } from 'redis';
var subscriber = redis.createClient({ host: 'localhost', port: 8888 });
var publisher = redis.createClient({ host: 'localhost', port: 8888 });

subscriber.psubscribe('node:*');
subscriber.on('pmessage', function(pattern, channel, message) {
  var method = channel.split(':')[1];
  var argv = message.split(',');

  if (method == 'ping') {
    // console.log('pong');
    publisher.publish('result:pong', '');
  } else if (method == 'start') {
    var worker = fork('./bin/start_benchmark.js', argv);
    worker.on('message', function(result) {
      publisher.publish('result:complete', JSON.stringify(result));
    });
  }
});
