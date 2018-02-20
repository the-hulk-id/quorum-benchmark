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

  echo "clone repository at node $ID"
  ssh -n $USER@$IP "sudo rm -rf api.log ethereum-benchmark"
  ssh -n $USER@$IP "git clone https://github.com/oatsaysai/ethereum-benchmark.git"
done