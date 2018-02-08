require('babel-register');

module.exports = {
  networks: {
    development: {
      host: '192.168.100.98',
      port: 22000,
      network_id: '*', // Match any network id
      gas: 6000000,
      gasPrice: 0
    }
  }
};
