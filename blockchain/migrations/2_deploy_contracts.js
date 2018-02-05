/* global artifacts:true */

var Benchmark = artifacts.require('Benchmark');

var fs = require('fs');
var objJSON = {};

module.exports = function(deployer) {
  deployer.deploy(Benchmark).then(() => {
    objJSON[Benchmark.contractName] = Benchmark.address;
  });
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
