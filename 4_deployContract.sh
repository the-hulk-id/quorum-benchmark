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
    scp -r $PWD/blockchain/migrations/2_deploy_contracts.js $USER@$IP:~/quorum-benchmark/blockchain/migrations/2_deploy_contracts.js
    ssh -n $USER@$IP "cd quorum-benchmark/blockchain/ && sudo rm -rf build && truffle migrate"
    rm -rf $PWD/build
    # scp -r $USER@$IP:~/quorum-benchmark/blockchain/build $PWD/
    scp -r $USER@$IP:~/quorum-benchmark/blockchain/contract_addresses.json $PWD/
  else
    echo "copy contract to node $ID"
    ssh -n $USER@$IP "cd quorum-benchmark/blockchain/ && sudo rm -rf build && truffle compile"
    # ssh -n $USER@$IP "cd quorum-benchmark/blockchain/ && sudo rm -rf build"
    # scp -r $PWD/build $USER@$IP:~/quorum-benchmark/blockchain
    scp -r $PWD/contract_addresses.json $USER@$IP:~/quorum-benchmark/blockchain/
  fi
done