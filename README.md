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
