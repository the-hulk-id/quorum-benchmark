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

  ssh -n $USER@$IP "docker image rm quorum -f"
  # ssh -n $USER@$IP "ifconfig | grep addr:10"
  # ssh -n $USER@$IP "ifconfig | grep addr:10"
  # ssh -n $USER@$IP "killall node"
  # ssh -n $USER@$IP "cd ethereum-benchmark && git reset --hard && git pull"
  # ssh -n $USER@$IP "cd ethereum-benchmark/blockchain/ && npm install"
  # ssh -n $USER@$IP "cd ethereum-benchmark/quorum_Api/ && npm install"
done