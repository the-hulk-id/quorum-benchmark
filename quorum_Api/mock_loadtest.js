var request = require('request');
var randomstring = require('randomstring');
var random = require('random-js')();

var size = [128, 512, 1024];

for (let i = 1; i <= 100; i++) {
  var options = {
    url: 'http://52.230.70.133:8181/send_all/' + i,
    method: 'POST',
    form: randomstring.generate(size[random.integer(0, 2)])
  };

  request(options, function(error, response, body) {
    console.log(body);
  });
}
