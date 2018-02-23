# Quorum Benchmark
### System Requirements
 - Ubuntu
 - nodejs
 - jq
 
### Copy SSH key to all azure VM
 ```sh
 ssh-copy-id user@host
 # should can ssh user@host without password
 ```
 
### Set up user and IP of azure VM
 ```sh
 set user and IP in server.json
 ```
 
### Clone this repository to all azure VM
 - clone this repository to your machine
 ```sh
 ./0_gitClone.sh
 ```
 
### Build docker image on azure VM
 - you can use 6 terminal for each VM
 ```sh
 # ssh to azure VM
 ssh user@host
 # install Docker
 sudo apt-get install docker.io -y
 # build docker image
 cd quorum-benchmark/quorum_Node/docker/ && docker build -t quorum .
 ```
 
### Install nodejs and dependencies on azure VM
 ```sh
 ./1_nodeInstall.sh
 ./2_npmInstall.sh
 ```
 
### Run quorum node on azure VM
 - set IP in /quorum_Node/permissioned-nodes.json
 ```sh
 ./3_runQuorumNode.sh
 ```

### Deploy smart contract on azure VM
 ```sh
 ./4_deployContract.sh
 ```
 
### Run Restful API on azure VM
 ```sh
 ./5_runAPI.sh
 ```
 
### How to send request to Quorum API
 - use loadtest project
 ```sh
 # clone from https://github.com/the-hulk-id/loadtest
 # Example how to use loadtest
 node loadtest.js -d 10 -m -100 -s 0 -a 10.0.1.13,8181,10.0.1.14,8181,10.0.1.15,8181,10.0.1.16,8181,10.0.1.17,8181,10.0.1.18,8181
 ```

### Check pending transaction on each node
 ```sh
 ./8_getTxpoolStatus.sh
 ```

### Get result from all node
 ```sh
 ./7_getResult.sh
 ```
 
### Stop quorum node on all azure VM
 ```sh
 ./6_stopNode.sh
 ```
