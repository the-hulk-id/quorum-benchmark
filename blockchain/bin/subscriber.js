#!/usr/bin/env node

import { fork } from 'child_process';
import { default as redis } from 'redis';
var subscriber = redis.createClient({ host: 'localhost', port: 8888 });
var publisher = redis.createClient({ host: 'localhost', port: 8888 });

subscriber.on('pmessage', function(pattern, channel, message) {
  var room = channel.split(':')[1];
  var argv = message.split(',');

  var worker = fork('./bin/start_benchmark.js', argv);

  worker.on('message', function(result) {
    publisher.publish('result:1', JSON.stringify(result));
  });
});

subscriber.psubscribe('node:*');
