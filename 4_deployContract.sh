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

  if [ $ID -eq 1 ]
  then
    echo "deploy contract at node $ID"
    ssh -n $USER@$IP "cd ethereum-benchmark/blockchain/ && sudo rm -rf build"
    ssh -n $USER@$IP "cd ethereum-benchmark/blockchain/ && truffle migrate"
    rm -rf $PWD/build
    scp -r $USER@$IP:~/ethereum-benchmark/blockchain/build $PWD/
  else
    echo "copy contract to node $ID"
    ssh -n $USER@$IP "cd ethereum-benchmark/blockchain/ && sudo rm -rf build"
    scp -r $PWD/build $USER@$IP:~/ethereum-benchmark/blockchain
  fi
done