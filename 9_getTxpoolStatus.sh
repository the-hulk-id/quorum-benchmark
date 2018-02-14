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

  # scp -r $PWD/quorum_Api/getPendingTxpool.js $USER@$IP:~/ethereum-benchmark/quorum_Api/getPendingTxpool.js
  echo "Node $ID"
  ssh -n $USER@$IP "node ethereum-benchmark/quorum_Api/getPendingTxpool.js"
done