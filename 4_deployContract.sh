#!/bin/bash

if hash jq 2>/dev/null; then
  echo "JQ installed.. Proceeding...";
else
  echo "JQ is not installed.. Installing JQ.."
  sudo apt install jq
fi

jq -c '.[] | { id, user, ip}' server.json | while read i; do
  ID=`echo $i | jq -r .id`
  USER=`echo $i | jq -r .user`
  IP=`echo $i | jq -r .ip`

  # scp -r $PWD/blockchain/index.js $USER@$IP:~/ethereum-benchmark/blockchain/index.js
  # scp -r $PWD/blockchain/truffle.js $USER@$IP:~/ethereum-benchmark/blockchain/truffle.js

  if [ $ID -eq 1 ]
  then
    ssh -n $USER@$IP "cd ethereum-benchmark/blockchain/ && sudo rm -rf build"
    ssh -n $USER@$IP "cd ethereum-benchmark/blockchain/ && truffle migrate"
    rm -rf $PWD/build
    scp -r $USER@$IP:~/ethereum-benchmark/blockchain/build $PWD/
  else
    ssh -n $USER@$IP "cd ethereum-benchmark/blockchain/ && sudo rm -rf build"
    scp -r $PWD/build $USER@$IP:~/ethereum-benchmark/blockchain
  fi
done