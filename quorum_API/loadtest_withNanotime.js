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
  'localhost:8181',
  'localhost:8181',
  'localhost:8181',
  'localhost:8181',
  'localhost:8181',
  'localhost:8181'
];

var startSeq = 1;
var round = 0;

var timer = new NanoTimer();
timer.setInterval(sendTx, '', '2m');
timer.setTimeout(clearInteval, [timer], '10002m');

function sendTx(options) {
  if (round == 6) round = 0;
  // console.log(round);
  var ip = listIP[round++];

  if (options == null) {
    options = {
      url: 'http://' + ip + '/send_all/' + startSeq++,
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
