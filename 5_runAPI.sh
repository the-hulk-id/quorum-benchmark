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

  echo "start API at node $ID"
  scp -r $PWD/blockchain/index.js $USER@$IP:~/quorum-benchmark/blockchain/index.js
  scp -r $PWD/quorum_API/src/server.js $USER@$IP:~/quorum-benchmark/quorum_API/src/server.js
  ssh -n $USER@$IP "sudo rm -rf api.log result.csv ~/quorum-benchmark/blockchain/result.csv"
  ssh -n $USER@$IP bash -c "'
    pkill -9 node
    cd quorum-benchmark/quorum_API/
    nohup npm run api > ~/api.log &
  '"
done

sleep 5
