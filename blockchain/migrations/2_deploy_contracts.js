/* global artifacts:true */

var Benchmark = artifacts.require('Benchmark');

var fs = require('fs');
var objJSON = {};

module.exports = function(deployer) {
  deployer.deploy(Benchmark).then(() => {
    objJSON[Benchmark.contractName] = Benchmark.address;
  });
  // deployer
  //   .deploy(Benchmark, {
  //     privateFor: [
  //       'QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=',
  //       '1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg=',
  //       'oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8=',
  //       'R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY=',
  //       'UfNSeSGySeKg11DVNEnqrUtxYRVor4+CvluI8tVv62Y='
  //     ]
  //   })
  //   .then(() => {
  //     objJSON[Benchmark.contractName] = Benchmark.address;
  //   });
  deployer.then(() => {
    fs.writeFile(
      'contract_addresses.json',
      JSON.stringify(objJSON, null, 2),
      err => {
        if (err) throw err;
      }
    );
  });
};
