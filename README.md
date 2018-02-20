## Blockchain Benchmark
 - Quorum blockchain

### System Requirements
 - Ubuntu 16.04 / OSX
 - nodejs
 - jq
 
### Build docker image on azure VM
 - after clone this repository
 ```sh
 cd ethereum-benchmark/node/docker/
 docker build -t quorum .
 ```
 
### How to run benchmark
 - clone this repository
 - set USER and IP in server.json
 - set IP in /node/permissioned-nodes.json
 - start geth node via SSH
 ```sh
 ./3_runNode.sh
 ```
 - deploy smart contract via SSH
 ```sh
 ./4_deployContract.sh
 ```
 - run Restful API via SSH
 ```sh
 ./5_runAPI.sh
 ```
 - test call API
 ```sh
 node quorum_Api/mock_loadtest.js
 ```


node loadtest.js -d 10 -m 1000 -s 0 -a 10.0.1.20,8181,10.0.1.21,8181,10.0.1.22,8181,10.0.1.23,8181,10.0.1.24,8181,10.0.1.25,8181


 node loadtest.js -d 10 -m 1000 -s 0 -a 10.0.1.13,8181,10.0.1.14,8181,10.0.1.15,8181,10.0.1.16,8181,10.0.1.17,8181,10.0.1.18,8181

 node loadtest.js -d 10 -m -100 -s 0 -a 10.0.1.13,8181,10.0.1.14,8181,10.0.1.15,8181,10.0.1.16,8181,10.0.1.17,8181,10.0.1.18,8181