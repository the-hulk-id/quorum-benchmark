var syslog = require('syslog-client');
var client = syslog.createClient('127.0.0.1', { port: 8888 });
client.log('ทดสอบ syslog');
