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
  ssh -n $USER@$IP "sudo rm -rf api.log quorum-benchmark"
  ssh -n $USER@$IP "git clone https://github.com/the-hulk-id/quorum-benchmark.git"
  # ssh -n $USER@$IP "cd quorum-benchmark && git reset --hard && git pull"
  # ssh -n $USER@$IP "docker rm -f quorum && docker image rm -f quorum"
  # ssh -n $USER@$IP "cd quorum-benchmark/blockchain && npm install ether-pudding --save-dev"
done
