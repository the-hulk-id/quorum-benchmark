## Blockchain Benchmark
 - Ethereum blockchain
 - Quorum blockchain

### System Requirements
 - Ubuntu 16.04
 - Docker
 
### How to run benchmark
 - [Installing Docker](#installing-docker)
 - [Start Ethereum Node](#start-ethereum-node)
 - [Start Quorum Node](#start-quorum-node)
 - [Installing nodejs and npm](#installing-nodejs-and-npm)
 - [Run Benchmark](#run-benchmark)

### Installing Docker
```
Follow steps in this link
https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/
```

### Start Ethereum Node
```sh
# build and run Docker
cd ethereum_docker/
docker build -t ethereum .
docker run --name ethereum -p 22000:22000 -v $(dirname "$PWD")/ethereum_script:/ethereum_script -it ethereum

# Run Ethereum Node in Container
./start.sh
# After done benchmark please run ./stop.sh for killall Geth
```

### Start Quorum Node
```sh
# build and run Docker
cd quorum_docker/
docker build -t quorum .
docker run --name quorum -p 22000:22000 -v $(dirname "$PWD")/quorum_script:/quorum_script -it quorum

# Run Quorum Node in Container
./start.sh
# After done benchmark please run ./stop.sh for killall Geth
```
 
### Installing nodejs and npm
```sh
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt install nodejs-legacy
```

### Run Benchmark
```sh
# Open another terminal in this repository
npm install
cd benchmark/
# Parameter tx is the number of transaction
node start_benchmark.js --tx 10

# Afrer done with benchmark you can view result in browser by run http-server
http-server
```
