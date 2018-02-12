var NanoTimer = require('nanotimer');
var request = require('request');
var randomstring = require('randomstring');
var random = require('random-js')();
var moment = require('moment-timezone');

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/send_result.csv', {
  flags: 'w'
});

function logger(d) {
  log_file.write(util.format(d) + '\n');
}

var size = [128, 512, 1024];
var listIP = [
  '52.187.27.143:8181',
  '52.187.179.80:8181',
  '52.187.28.154:8181',
  '52.187.25.120:8181',
  '52.187.26.77:8181',
  '52.187.25.18:8181'
];

var startSeq = 1;

var timer = new NanoTimer();
timer.setInterval(sendTx, '', '5m');
timer.setTimeout(clearInteval, [timer], '50s');

function sendTx(options) {
  if (options == null) {
    options = {
      url: 'http://' + listIP[random.integer(0, 5)] + '/send_all/' + startSeq++,
      method: 'POST',
      form: {
        message: randomstring.generate(size[random.integer(0, 2)])
      }
    };
  }

  var seq = options.url.split('/')[4];

  request(options, function(error) {
    if (error != undefined) {
      sendTx(options);
    } else {
      console.log('Send seq: ' + seq + ' completed');
      var now = moment()
        .tz('Asia/Bangkok')
        .format('YYMMDDHHmmss.SSS');
      logger(now + '|' + seq + '|' + options.form.message);
    }
  });
}

function clearInteval(timer) {
  timer.clearInterval();
}